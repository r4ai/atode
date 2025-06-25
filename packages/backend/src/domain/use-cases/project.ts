import type {
  CreateProjectData,
  Project,
  ProjectId,
  UpdateProjectData,
} from "@/domain/entities/project"
import type { UserId } from "@/domain/entities/user"
import type { ProjectRepository } from "@/domain/repositories/project"

type ProjectDependencies = {
  repository: {
    project: ProjectRepository
  }
}

export const getProject = async (
  deps: ProjectDependencies,
  id: ProjectId,
  userId: UserId,
): Promise<Project | null> => {
  const projects = await deps.repository.project.find({ id, userId })
  return projects[0] ?? null
}

export const getProjects = async (
  deps: ProjectDependencies,
  userId: UserId,
  parentProjectId?: ProjectId | null,
): Promise<Project[]> => {
  return await deps.repository.project.find({ userId, parentProjectId })
}

export const getChildProjects = async (
  deps: ProjectDependencies,
  parentProjectId: ProjectId,
  userId: UserId,
): Promise<Project[]> => {
  // First verify parent project exists and user has access
  const parentProject = await getProject(deps, parentProjectId, userId)
  if (!parentProject) {
    throw new Error("Parent project not found")
  }

  return await deps.repository.project.findChildren(parentProjectId)
}

export const createProject = async (
  deps: ProjectDependencies,
  data: CreateProjectData,
): Promise<Project> => {
  // Business logic: Verify parent project exists and user has access
  if (data.parentProjectId) {
    const parentProject = await getProject(
      deps,
      data.parentProjectId,
      data.userId,
    )
    if (!parentProject) {
      throw new Error("Parent project not found")
    }
  }

  return await deps.repository.project.create(data)
}

export const updateProject = async (
  deps: ProjectDependencies,
  id: ProjectId,
  data: UpdateProjectData,
  userId: UserId,
): Promise<Project> => {
  const project = await getProject(deps, id, userId)
  if (!project) {
    throw new Error("Project not found")
  }

  // Business logic: If changing parent, verify new parent exists and user has access
  if (data.parentProjectId !== undefined) {
    if (data.parentProjectId !== null) {
      const parentProject = await getProject(deps, data.parentProjectId, userId)
      if (!parentProject) {
        throw new Error("Parent project not found")
      }

      // Prevent circular references
      if (data.parentProjectId === id) {
        throw new Error("Project cannot be its own parent")
      }
    }
  }

  const updatedProject = await deps.repository.project.update(id, data)
  if (!updatedProject) {
    throw new Error("Failed to update project")
  }

  return updatedProject
}

export const deleteProject = async (
  deps: ProjectDependencies,
  id: ProjectId,
  userId: UserId,
): Promise<void> => {
  const project = await getProject(deps, id, userId)
  if (!project) {
    throw new Error("Project not found")
  }

  // Business logic: Check if project has child projects
  const childProjects = await deps.repository.project.findChildren(id)
  if (childProjects.length > 0) {
    throw new Error("Cannot delete project with child projects")
  }

  const deleted = await deps.repository.project.delete(id)
  if (!deleted) {
    throw new Error("Failed to delete project")
  }
}
