import { app } from "./app"

const port = Number(process.env.PORT) || 3000

console.log(`Server is running on port ${port}`)
console.log(`API Documentation: http://localhost:${port}/api/docs`)
console.log(`OpenAPI Spec: http://localhost:${port}/api/openapi`)

export default {
  fetch: app.fetch,
  port,
}
