import { faker } from "@faker-js/faker"
import type { CreateTaskData, Task } from "./task"

// Task factories
export const createRandomTask = (overrides: Partial<Task> = {}): Task => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  userId: faker.number.int({ min: 1, max: 100 }),
  projectId: faker.number.int({ min: 1, max: 100 }),
  parentTaskId: null,
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement([
    "pending",
    "in_progress",
    "completed",
    "cancelled",
  ]),
  priority: faker.number.int({ min: 1, max: 5 }),
  dueDate: faker.date.future(),
  completedAt: null,
  path: null,
  depth: faker.number.int({ min: 0, max: 3 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
  ...overrides,
})

export const createRandomTaskData = (
  overrides: Partial<CreateTaskData> = {},
): CreateTaskData => ({
  userId: faker.number.int({ min: 1, max: 100 }),
  projectId: faker.number.int({ min: 1, max: 100 }),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  priority: faker.number.int({ min: 1, max: 5 }),
  dueDate: faker.date.future(),
  ...overrides,
})

// Utility functions
export const createRandomTasks = (count: number = 5): Task[] =>
  Array.from({ length: count }, () => createRandomTask())
