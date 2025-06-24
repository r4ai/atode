import { vi } from "vitest"
import type { TaskRepository } from "./task"

// Repository mock factory
export const createMockTaskRepository = (): TaskRepository => ({
  find: vi.fn(),
  count: vi.fn(),
  findChildren: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  markCompleted: vi.fn(),
  delete: vi.fn(),
})
