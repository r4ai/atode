import { vi } from "vitest"
import type { ProjectRepository } from "./project"

// Repository mock factory
export const createMockProjectRepository = () =>
  ({
    find: vi.fn(),
    findChildren: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }) as const satisfies ProjectRepository
