import type { ProjectId } from "@/domain/entities/project"
import type { UserId } from "@/domain/entities/user"

export type TaskId = number

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled"

export type Task = {
  id: TaskId
  userId: UserId
  projectId: ProjectId
  parentTaskId?: TaskId | null
  title: string
  description?: string | null
  status: TaskStatus
  priority: number
  dueDate?: Date | null
  completedAt?: Date | null
  path?: string | null
  depth: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type CreateTaskData = {
  userId: UserId
  projectId: ProjectId
  parentTaskId?: TaskId
  title: string
  description?: string
  priority?: number
  dueDate?: Date
}

export type UpdateTaskData = Partial<
  Omit<CreateTaskData, "userId" | "projectId"> & {
    status?: TaskStatus
    completedAt?: Date
  }
>
