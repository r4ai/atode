import type { ProjectId } from "@/domain/entities/project"
import type {
  CreateTaskData,
  Task,
  TaskId,
  TaskStatus,
  UpdateTaskData,
} from "@/domain/entities/task"
import type { UserId } from "@/domain/entities/user"

export type TaskFilters = {
  projectId?: ProjectId
  status?: TaskStatus
  dueBefore?: Date
  search?: string
  page?: number
  limit?: number
}

export type TaskRepository = {
  findById(id: TaskId): Promise<Task | null>
  findByProjectId(projectId: ProjectId): Promise<Task[]>
  findByUserId(userId: UserId, filters?: TaskFilters): Promise<Task[]>
  findChildren(taskId: TaskId): Promise<Task[]>
  create(data: CreateTaskData): Promise<Task>
  update(id: TaskId, data: UpdateTaskData): Promise<Task | null>
  markCompleted(id: TaskId): Promise<Task | null>
  delete(id: TaskId): Promise<boolean>
}
