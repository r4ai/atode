import { faker } from "@faker-js/faker"
import type { CreateProjectData, Project } from "./project"

// Project factories
export const createRandomProject = (
  overrides: Partial<Project> = {},
): Project => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  userId: faker.number.int({ min: 1, max: 100 }),
  parentProjectId: null,
  name: faker.company.name(),
  description: faker.lorem.paragraph(),
  color: faker.color.rgb(),
  path: null,
  depth: faker.number.int({ min: 0, max: 3 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
  ...overrides,
})

export const createRandomProjectData = (
  overrides: Partial<CreateProjectData> = {},
): CreateProjectData => ({
  userId: faker.number.int({ min: 1, max: 100 }),
  name: faker.company.name(),
  description: faker.lorem.paragraph(),
  color: faker.color.rgb(),
  ...overrides,
})

// Utility functions
export const createRandomProjects = (count: number = 3): Project[] =>
  Array.from({ length: count }, () => createRandomProject())
