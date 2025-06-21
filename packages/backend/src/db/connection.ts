import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/todoapp",
})

export const db = drizzle(pool, { schema })

export async function testConnection() {
  try {
    const client = await pool.connect()
    console.log("✅ Database connection successful")
    client.release()
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}
