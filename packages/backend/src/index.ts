import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { describeRoute, openAPISpecs } from "hono-openapi"
import { resolver } from "hono-openapi/valibot"
import { Scalar } from "@scalar/hono-api-reference"
import * as v from "valibot"
import { taskRepository } from "@/infrastructure/repositories/task"
import { userRepository } from "@/infrastructure/repositories/user"
import type { Dependencies } from "@/presentation/dependencies"
// Import routes and dependencies
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
              v.object({
                status: v.literal("ok"),
                timestamp: v.string(),
                version: v.string(),
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

// API Routes
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

// Root health check
mainApp.get("/", (c) => {
  return c.json({
    message: "TODO API Server",
    version: "1.0.0",
    docs: "/api/docs",
    openapi: "/api/openapi",
  })
})

const port = Number(process.env.PORT) || 3000

console.log(`Server is running on port ${port}`)
console.log(`API Documentation: http://localhost:${port}/api/docs`)
console.log(`OpenAPI Spec: http://localhost:${port}/api/openapi`)

serve({
  fetch: mainApp.fetch,
  port,
})
