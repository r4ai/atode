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

type BaseFindOptions = {
  parentTaskId?: TaskId
  includeDeleted?: boolean
  filters?: TaskFilters
}

export type FindOptions = BaseFindOptions &
  (
    | { id: TaskId; userId?: never; projectId?: never }
    | { id?: never; userId: UserId; projectId?: ProjectId }
    | { id?: never; userId?: never; projectId: ProjectId }
  )

export type TaskRepository = {
  find(options: FindOptions): Promise<Task[]>
  count(
    userId: UserId,
    filters?: Omit<TaskFilters, "page" | "limit">,
  ): Promise<number>
  findChildren(taskId: TaskId): Promise<Task[]>
  create(data: CreateTaskData): Promise<Task>
  update(id: TaskId, data: UpdateTaskData): Promise<Task | null>
  markCompleted(id: TaskId): Promise<Task | null>
  delete(id: TaskId): Promise<boolean>
}
