import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:password@localhost:5432/atodeapp",
})

export type DB = NodePgDatabase<typeof schema> & {
  $client: Pool
}

export const db: DB = drizzle(pool, { schema })

export const testConnection = async () => {
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
