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

export type FindByIdOptions = {
  includeDeleted?: boolean
}

export type TaskRepository = {
  findById(id: TaskId, options?: FindByIdOptions): Promise<Task | null>
  findByProjectId(projectId: ProjectId): Promise<Task[]>
  findByUserId(userId: UserId, filters?: TaskFilters): Promise<Task[]>
  countByUserId(
    userId: UserId,
    filters?: Omit<TaskFilters, "page" | "limit">,
  ): Promise<number>
  findChildren(taskId: TaskId): Promise<Task[]>
  create(data: CreateTaskData): Promise<Task>
  update(id: TaskId, data: UpdateTaskData): Promise<Task | null>
  markCompleted(id: TaskId): Promise<Task | null>
  delete(id: TaskId): Promise<boolean>
}
