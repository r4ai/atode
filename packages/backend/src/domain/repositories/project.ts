import type {
  CreateProjectData,
  Project,
  ProjectId,
  UpdateProjectData,
} from "@/domain/entities/project"
import type { UserId } from "@/domain/entities/user"

export type ProjectRepository = {
  findById(id: ProjectId): Promise<Project | null>
  findByUserId(userId: UserId): Promise<Project[]>
  findChildren(projectId: ProjectId): Promise<Project[]>
  create(data: CreateProjectData): Promise<Project>
  update(id: ProjectId, data: UpdateProjectData): Promise<Project | null>
  delete(id: ProjectId): Promise<boolean>
}
