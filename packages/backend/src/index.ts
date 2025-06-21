import { serve } from "@hono/node-server"
import { swaggerUI } from "@hono/swagger-ui"
import { apiReference } from "@scalar/hono-api-reference"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { describeRoute } from "hono-openapi"
import { resolver } from "hono-openapi/valibot"
import * as v from "valibot"
// Import routes
import { taskRoutes } from "./presentation/routes/task"
// Import schemas
import { ApiResponseSchema } from "./schemas/valibot"

// Create Hono app
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

// API Routes
app.route("/api/tasks", taskRoutes)

// OpenAPI documentation endpoint
app.get("/openapi.json", (c) => {
  return c.json({
    openapi: "3.0.0",
    info: {
      title: "TODO API",
      version: "1.0.0",
      description:
        "A comprehensive TODO application API with hierarchical projects and tasks",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://api.example.com"
            : "http://localhost:3000",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    paths: {},
    components: {
      schemas: {},
    },
  })
})

// API Documentation with Scalar
app.get(
  "/docs",
  apiReference({
    theme: "kepler",
    spec: { url: "/openapi.json" },
  } as any),
)

// Swagger UI as alternative
app.get("/swagger", swaggerUI({ url: "/openapi.json" }))

// Health check endpoint
app.get(
  "/",
  describeRoute({
    summary: "Health check",
    description: "Check if the API server is running",
    responses: {
      200: {
        description: "API server status",
        content: {
          "application/json": {
            schema: resolver(
              ApiResponseSchema(
                v.object({
                  message: v.string(),
                  version: v.string(),
                  status: v.string(),
                }),
              ),
            ),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json({
      data: {
        message: "TODO API Server",
        version: "1.0.0",
        status: "running",
      },
      status: "success",
    })
  },
)

// Error handling
app.onError((err, c) => {
  console.error("Error:", err)
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message ?? "An unexpected error occurred",
      status: "error",
    },
    500,
  )
})

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: "Not Found",
      message: "The requested resource was not found",
      status: "error",
    },
    404,
  )
})

const port = parseInt(process.env.PORT ?? "3000")

console.log(`Server is running on http://localhost:${port}`)
console.log(`API Documentation available at http://localhost:${port}/docs`)
console.log(`OpenAPI JSON available at http://localhost:${port}/openapi.json`)

serve({
  fetch: app.fetch,
  port,
})
