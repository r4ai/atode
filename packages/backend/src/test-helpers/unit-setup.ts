import { faker } from "@faker-js/faker"
import { beforeEach } from "vitest"

beforeEach(() => {
  faker.seed(123)
})
