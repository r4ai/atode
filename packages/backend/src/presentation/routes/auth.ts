import { authHandler } from "@hono/auth-js"
import { Hono } from "hono"

export const createAuthRoutes = () => {
  const auth = new Hono()

  // Handle all Auth.js routes (/*) - prefix already handled by main router
  auth.use("/*", authHandler())

  return auth
}
