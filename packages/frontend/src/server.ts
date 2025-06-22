import { Hono } from "hono"

const app = new Hono().basePath("/api")

app.get("/hello", (c) => {
  return c.text("Hello, world!")
})

export default app
