import type { UserId } from "@/domain/entities/user"

export type ProjectId = number

export type Project = {
  id: ProjectId
  userId: UserId
  parentProjectId?: ProjectId | null
  name: string
  description?: string | null
  color: string
  path?: string | null
  depth: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type CreateProjectData = {
  userId: UserId
  parentProjectId?: ProjectId
  name: string
  description?: string
  color?: string
  depth?: number
}

export type UpdateProjectData = Partial<Omit<CreateProjectData, "userId">>
