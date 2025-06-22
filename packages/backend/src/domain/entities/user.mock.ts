import { faker } from "@faker-js/faker"
import type { CreateUserData, User } from "./user"

// User factories
export const createRandomUser = (overrides: Partial<User> = {}): User => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  email: faker.internet.email(),
  displayName: faker.person.fullName(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
  ...overrides,
})

export const createRandomUserData = (
  overrides: Partial<CreateUserData> = {},
): CreateUserData => ({
  email: faker.internet.email(),
  displayName: faker.person.fullName(),
  ...overrides,
})

// Utility functions
export const createRandomUsers = (count: number = 3): User[] =>
  Array.from({ length: count }, () => createRandomUser())
