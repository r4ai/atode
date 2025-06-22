import { faker } from "@faker-js/faker"
import { afterAll, beforeAll, beforeEach } from "vitest"

// Set consistent seed for reproducible tests
beforeAll(() => {
  faker.seed(123)
  console.log("✅ Test setup: faker.js initialized with seed 123")
})

afterAll(() => {
  console.log("🧹 Test teardown: cleanup completed")
})

beforeEach(() => {
  // Reset faker state for each test to ensure consistency
  faker.seed(123)
})
