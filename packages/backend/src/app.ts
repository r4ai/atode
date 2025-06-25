import GitHub from "@auth/core/providers/github"
import { initAuthConfig, verifyAuth } from "@hono/auth-js"
import { Scalar } from "@scalar/hono-api-reference"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import {
  describeRoute,
  type OpenApiSpecsOptions,
  openAPISpecs,
} from "hono-openapi"
import { resolver } from "hono-openapi/zod"
import { z } from "zod"
import { db } from "@/infrastructure/database/connection"
import { createProjectRepository } from "@/infrastructure/repositories/project"
import { createTaskRepository } from "@/infrastructure/repositories/task"
import { createUserRepository } from "@/infrastructure/repositories/user"
import type { Dependencies } from "@/presentation/dependencies"
import { createAuthRoutes } from "@/presentation/routes/auth"
import { createProjectRoutes } from "@/presentation/routes/project"
import { createTaskRoutes } from "@/presentation/routes/task"

const dependencies = {
  repository: {
    task: createTaskRepository({ db }),
    user: createUserRepository({ db }),
    project: createProjectRepository({ db }),
  },
} as const satisfies Dependencies

export const openApiSpecsOptions = {
  documentation: {
    info: {
      title: "Atode API",
      version: "1.0.0",
      description:
        "A comprehensive todo application API with hierarchical projects and tasks, built with Hono, PostgreSQL, and Drizzle ORM",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://api.example.com/api" // TODO: Replace with actual production URL
            : "http://localhost:3000/api",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    tags: [
      {
        name: "health",
        description: "Health check operations",
      },
      {
        name: "auth",
        description: "Authentication operations",
      },
      {
        name: "tasks",
        description: "Task management operations",
      },
      {
        name: "projects",
        description: "Project management operations",
      },
      {
        name: "labels",
        description: "Label management operations",
      },
      {
        name: "comments",
        description: "Comment management operations",
      },
    ],
  },
} as const satisfies OpenApiSpecsOptions

// Create Hono app with OpenAPI support
const api = new Hono()

// Middleware
api.use("*", logger())
api.use("*", prettyJSON())
api.use(
  "*",
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["http://localhost:3001"]
        : ["http://localhost:3001", "http://localhost:5173"],
    credentials: true,
  }),
)
api.use(
  "*",
  initAuthConfig((c) => ({
    secret: c.env.AUTH_SECRET,
    trustHost: true,
    providers: [
      GitHub({
        clientId: c.env.GITHUB_ID,
        clientSecret: c.env.GITHUB_SECRET,
      }),
    ],
    callbacks: {
      // Handle successful sign in
      async signIn({ user }) {
        console.log("Sign in callback:", { user })
        return true
      },
      // Handle session data
      async session({ session, user, token }) {
        console.log("Session callback:", { session, user, token })

        // Sync user with database on session creation
        if (session?.user?.email) {
          try {
            const email = session.user.email
            const name = session.user.name ?? session.user.email.split("@")[0]

            // Check if user exists in database
            const users = await dependencies.repository.user.find({ email })
            let user = users[0] ?? null

            if (!user) {
              // Create new user on first login
              user = await dependencies.repository.user.create({
                email,
                displayName: name,
              })
              console.log("Created new user:", user)
            } else if (user.deletedAt) {
              // Reactivate soft-deleted user
              user = await dependencies.repository.user.create({
                email,
                displayName: name,
              })
              console.log("Reactivated user:", user)
            } else {
              // Update display name if changed
              if (name && name !== user.displayName) {
                const updatedUser = await dependencies.repository.user.update(
                  user.id,
                  {
                    displayName: name,
                  },
                )
                if (updatedUser) {
                  user = updatedUser
                  console.log("Updated user:", user)
                }
              }
            }
          } catch (error) {
            console.error("Failed to sync user with database:", error)
          }
        }

        return session
      },
      redirect({ url }) {
        console.log("Redirect callback:", { url })
        return url
      },
    },
  })),
)

// Health check endpoint
api.get(
  "/health",
  describeRoute({
    description: "Health check endpoint",
    tags: ["health"],
    responses: {
      200: {
        description: "API is healthy",
        content: {
          "application/json": {
            schema: resolver(
              z.object({
                status: z.literal("ok"),
                timestamp: z.string(),
                version: z.string(),
              }),
            ),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json({
      status: "ok" as const,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    })
  },
)

// Auth routes (authentication handled within auth routes)
api.route("/auth", createAuthRoutes())

// Protected API Routes
api.use("/tasks/*", verifyAuth())
api.route("/tasks", createTaskRoutes(dependencies))

api.use("/projects/*", verifyAuth())
api.route("/projects", createProjectRoutes(dependencies))

// OpenAPI specification endpoint
api.get("/openapi", openAPISpecs(api, openApiSpecsOptions))

// API documentation UI with Scalar
api.get(
  "/docs",
  Scalar({
    theme: "saturn",
    url: "/api/openapi",
  }),
)

// Create main app with API routes
export const app = new Hono().route("/api", api)
