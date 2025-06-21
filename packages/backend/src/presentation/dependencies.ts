import type { ProjectRepository } from "@/domain/repositories/project"
import type { TaskRepository } from "@/domain/repositories/task"
import type { UserRepository } from "@/domain/repositories/user"

export type Dependencies = {
  repository: {
    task: TaskRepository
    user: UserRepository
    project: ProjectRepository
  }
}
