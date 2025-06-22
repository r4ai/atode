import GitHub from "@auth/core/providers/github"
import { initAuthConfig, verifyAuth } from "@hono/auth-js"
import { serve } from "@hono/node-server"
import { Scalar } from "@scalar/hono-api-reference"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { describeRoute, openAPISpecs } from "hono-openapi"
import { resolver } from "hono-openapi/zod"
import { z } from "zod"
import { taskRepository } from "@/infrastructure/repositories/task"
import { userRepository } from "@/infrastructure/repositories/user"
import type { Dependencies } from "@/presentation/dependencies"
import { createAuthRoutes } from "@/presentation/routes/auth"
import { createTaskRoutes } from "@/presentation/routes/task"

const dependencies = {
  repository: {
    task: taskRepository,
    user: userRepository,
    // TODO: Implement project repository
    project: {
      create: async () => {
        throw new Error("Project repository not implemented")
      },
      delete: async () => {
        throw new Error("Project repository not implemented")
      },
      findById: async () => {
        throw new Error("Project repository not implemented")
      },
      findByUserId: async () => {
        throw new Error("Project repository not implemented")
      },
      update: async () => {
        throw new Error("Project repository not implemented")
      },
      findChildren: async () => {
        throw new Error("Project repository not implemented")
      },
    },
  },
} as const satisfies Dependencies

// Create Hono app with OpenAPI support
const app = new Hono()

// Middleware
app.use("*", logger())
app.use("*", prettyJSON())
app.use(
  "*",
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["http://localhost:3001"]
        : ["http://localhost:3001", "http://localhost:5173"],
    credentials: true,
  }),
)
app.use(
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
            let user = await dependencies.repository.user.findByEmail(email)

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
                user = await dependencies.repository.user.update(user.id, {
                  displayName: name,
                })
                console.log("Updated user:", user)
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
app.get(
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
app.route("/auth", createAuthRoutes())

// Protected API Routes
app.use("/tasks/*", verifyAuth())
app.route("/tasks", createTaskRoutes(dependencies))

// OpenAPI specification endpoint
app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "TODO API",
        version: "1.0.0",
        description:
          "A comprehensive TODO application API with hierarchical projects and tasks, built with Hono, PostgreSQL, and Drizzle ORM",
      },
      servers: [
        {
          url:
            process.env.NODE_ENV === "production"
              ? "https://api.example.com/api"
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
  }),
)

// API documentation UI with Scalar
app.get(
  "/docs",
  Scalar({
    theme: "saturn",
    url: "/api/openapi",
  }),
)

// Create main app with API routes
const mainApp = new Hono()
mainApp.route("/api", app)

const port = Number(process.env.PORT) || 3000

console.log(`Server is running on port ${port}`)
console.log(`API Documentation: http://localhost:${port}/api/docs`)
console.log(`OpenAPI Spec: http://localhost:${port}/api/openapi`)

serve({
  fetch: mainApp.fetch,
  port,
})
