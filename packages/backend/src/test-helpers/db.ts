import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"
import { test as testBase } from "vitest"
import type { DB } from "@/infrastructure/database/connection"
import * as schema from "@/infrastructure/database/schema"
import { createProjectRepository } from "@/infrastructure/repositories/project"
import { createTaskRepository } from "@/infrastructure/repositories/task"
import { createUserRepository } from "@/infrastructure/repositories/user"
import type { Dependencies } from "@/presentation/dependencies"

export const INITIAL_SNAPSHOT = "initial"

export type TestDatabase = {
  readonly container: StartedPostgreSqlContainer
  readonly db: DB
  readonly client: Pool
}

export const migrateDatabase = async (
  container: StartedPostgreSqlContainer,
): Promise<void> => {
  const client = new Pool({
    connectionString: container.getConnectionUri(),
  })
  const db = drizzle(client, { schema })

  try {
    await migrate(db, { migrationsFolder: "drizzle" })
  } finally {
    await client.end()
  }
}

export const getWorkerId = () =>
  process.env.VITEST_POOL_ID ?? `single_${Date.now()}`

export const createTestContainer =
  async (): Promise<StartedPostgreSqlContainer> => {
    const workerId = getWorkerId()
    const label = `[INFO] Creating test container for worker ${workerId}`
    console.time(label)

    const container = await new PostgreSqlContainer("postgres:15-alpine")
      .withDatabase(`app_test_${workerId.replace(/[^a-zA-Z0-9]/g, "_")}`)
      .withUsername("tester")
      .withPassword("secret")
      .withStartupTimeout(30000)
      .withCommand([
        "postgres",
        "-c",
        "fsync=off",
        "-c",
        "synchronous_commit=off",
      ])
      .start()

    // Run migrations
    await migrateDatabase(container)

    // Create initial snapshot
    await container.snapshot(INITIAL_SNAPSHOT)

    // Cache the container for reuse
    globalThis.__TEST_CONTAINERS__ ??= {}
    globalThis.__TEST_CONTAINERS__[workerId] = container

    console.timeEnd(label)

    return container
  }

export const getOrCreateTestContainer =
  async (): Promise<StartedPostgreSqlContainer> => {
    const workerId = getWorkerId()
    const container = globalThis.__TEST_CONTAINERS__[workerId]
    return container ?? createTestContainer()
  }

export const createTestDatabase = async (): Promise<TestDatabase> => {
  // Get or create worker-specific container
  const container = await getOrCreateTestContainer()

  // Create fresh database connection
  const client = new Pool({
    connectionString: container.getConnectionUri(),
  })
  const db = drizzle(client, { schema })

  return { container, db, client }
}

export const cleanupTestDatabase = async (testDb: TestDatabase) => {
  // Close existing connections
  if (!testDb.client.ended) {
    await testDb.client.end()
  }

  // Restore database to initial snapshot
  await testDb.container.restoreSnapshot(INITIAL_SNAPSHOT)
}

export const resetTestDatabase = async (
  testDb: TestDatabase,
): Promise<TestDatabase> => {
  // Close existing connections
  await testDb.client.end()

  // Restore database to initial snapshot
  await testDb.container.restoreSnapshot(INITIAL_SNAPSHOT)

  // Recreate database connection
  const newClient = new Pool({
    connectionString: testDb.container.getConnectionUri(),
  })
  const newDb = drizzle(newClient, { schema })

  return {
    container: testDb.container,
    db: newDb,
    client: newClient,
  }
}

export const cleanupAllTestContainers = async () => {
  const stopping = Object.values(globalThis.__TEST_CONTAINERS__).map(
    (container) => container.stop(),
  )
  await Promise.all(stopping)
}

export const createDependencies = (db: DB): Dependencies => ({
  repository: {
    user: createUserRepository({ db }),
    task: createTaskRepository({ db }),
    project: createProjectRepository({ db }),
  },
})

export type Env = {
  db: TestDatabase["db"]
  deps: Dependencies
}

/**
 *  Test environment for integration tests.
 */
const test = testBase.extend<{ env: Env }>({
  // biome-ignore lint/correctness/noEmptyPattern: The first argument inside a fixture must use object destructuring pattern, e.g. ({ test } => {}). Instead, "_".
  env: async ({}, use) => {
    const testDb = await createTestDatabase()
    const deps = createDependencies(testDb.db)

    try {
      await use({
        db: testDb.db,
        deps,
      })
    } finally {
      await cleanupTestDatabase(testDb)
    }
  },
})
export { test, test as it }
