import { vi } from "vitest"
import type { UserRepository } from "./user"

// Repository mock factory
export const createMockUserRepository = (): UserRepository => ({
  findById: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
})
