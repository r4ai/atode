import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"

import { todoRoutes } from "./routes/todos"

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

// Health check
app.get("/", (c) => {
  return c.json({
    message: "TODO API Server",
    version: "1.0.0",
    status: "running",
  })
})

// API Routes
app.route("/api/todos", todoRoutes)

const port = parseInt(process.env.PORT || "3000")

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
