import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/infrastructure/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:password@localhost:5432/todoapp",
  },
  verbose: true,
  strict: true,
})
