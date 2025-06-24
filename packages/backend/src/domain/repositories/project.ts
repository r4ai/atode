import type {
  CreateProjectData,
  Project,
  ProjectId,
  UpdateProjectData,
} from "@/domain/entities/project"
import type { UserId } from "@/domain/entities/user"

type FindProjectOptions = {
  id?: ProjectId
  userId?: UserId
  parentProjectId?: ProjectId
}

export type ProjectRepository = {
  find(options: FindProjectOptions): Promise<Project[]>
  findChildren(projectId: ProjectId): Promise<Project[]>
  create(data: CreateProjectData): Promise<Project>
  update(id: ProjectId, data: UpdateProjectData): Promise<Project | null>
  delete(id: ProjectId): Promise<boolean>
}
