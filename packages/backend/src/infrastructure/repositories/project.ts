import { eq } from "drizzle-orm"
import type {
  CreateProjectData,
  Project,
  ProjectId,
} from "@/domain/entities/project"
import type { UserId } from "@/domain/entities/user"
import type { ProjectRepository } from "@/domain/repositories/project"
import type { DB } from "@/infrastructure/database/connection"
import type { Project as DbProject } from "@/infrastructure/database/schema"
import { projects } from "@/infrastructure/database/schema"

// Helper function to convert DB project to domain project
const toDomainProject = (dbProject: DbProject): Project => ({
  id: dbProject.id,
  userId: dbProject.userId,
  parentProjectId: dbProject.parentProjectId,
  name: dbProject.name,
  description: dbProject.description,
  color: dbProject.color ?? "#808080",
  path: dbProject.path,
  depth: dbProject.depth,
  createdAt: dbProject.createdAt,
  updatedAt: dbProject.updatedAt,
  deletedAt: dbProject.deletedAt,
})

type Dependencies = {
  db: DB
}

const findProjects =
  ({ db }: Dependencies) =>
  async (options: {
    id?: ProjectId
    userId?: UserId
    parentProjectId?: ProjectId
  }): Promise<Project[]> => {
    if (options.id) {
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.id, options.id))
      return result.map(toDomainProject)
    }

    if (options.userId) {
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, options.userId))
      return result.map(toDomainProject)
    }

    if (options.parentProjectId) {
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.parentProjectId, options.parentProjectId))
      return result.map(toDomainProject)
    }

    const result = await db.select().from(projects)
    return result.map(toDomainProject)
  }

const findProjectChildren =
  ({ db }: Dependencies) =>
  async (projectId: ProjectId): Promise<Project[]> => {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.parentProjectId, projectId))
    return result.map(toDomainProject)
  }

const createProject =
  ({ db }: Dependencies) =>
  async (data: CreateProjectData): Promise<Project> => {
    const createdProject = await db
      .insert(projects)
      .values({
        userId: data.userId,
        parentProjectId: data.parentProjectId,
        name: data.name,
        description: data.description,
        color: data.color ?? "#808080",
        depth: data.depth ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
    return toDomainProject(createdProject[0])
  }

const updateProject =
  ({ db }: Dependencies) =>
  async (
    id: ProjectId,
    data: Partial<CreateProjectData>,
  ): Promise<Project | null> => {
    const result = await db
      .update(projects)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning()
    return result[0] ? toDomainProject(result[0]) : null
  }

const deleteProject =
  ({ db }: Dependencies) =>
  async (id: ProjectId): Promise<boolean> => {
    const result = await db
      .update(projects)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning()
    return result.length > 0
  }

// Create a repository object that implements ProjectRepository interface
export const createProjectRepository = (
  deps: Dependencies,
): ProjectRepository => ({
  find: findProjects(deps),
  findChildren: findProjectChildren(deps),
  create: createProject(deps),
  update: updateProject(deps),
  delete: deleteProject(deps),
})
