import { faker } from "@faker-js/faker"
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql"
import { beforeEach } from "vitest"

// Global container cache for parallel execution safety
declare global {
  var __TEST_CONTAINERS__: Record<string, StartedPostgreSqlContainer>
}

globalThis.__TEST_CONTAINERS__ ??= {}

beforeEach(() => {
  faker.seed(123)
})
