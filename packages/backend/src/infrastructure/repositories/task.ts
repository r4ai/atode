import { and, eq, ilike, isNull, lte, or } from "drizzle-orm"
import type { ProjectId } from "@/domain/entities/project"
import type {
  CreateTaskData,
  Task,
  TaskId,
  UpdateTaskData,
} from "@/domain/entities/task"
import type { UserId } from "@/domain/entities/user"
import type { TaskFilters, TaskRepository } from "@/domain/repositories/task"
import type { DB } from "@/infrastructure/database/connection"
import type { Task as DbTask } from "@/infrastructure/database/schema"
import { tasks } from "@/infrastructure/database/schema"

// Helper function to convert DB task to domain task
const toDomainTask = (dbTask: DbTask): Task => ({
  id: dbTask.id,
  userId: dbTask.userId,
  projectId: dbTask.projectId,
  parentTaskId: dbTask.parentTaskId,
  title: dbTask.title,
  description: dbTask.description,
  status: dbTask.status,
  priority: dbTask.priority,
  dueDate: dbTask.dueDate,
  completedAt: dbTask.completedAt,
  path: dbTask.path,
  depth: dbTask.depth,
  createdAt: dbTask.createdAt,
  updatedAt: dbTask.updatedAt,
  deletedAt: dbTask.deletedAt,
})

type Dependencies = {
  db: DB
}

const findTaskById =
  ({ db }: Dependencies) =>
  async (id: TaskId): Promise<Task | null> => {
    const result = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), isNull(tasks.deletedAt)))
    return result[0] ? toDomainTask(result[0]) : null
  }

const findTasksByProjectId =
  ({ db }: Dependencies) =>
  async (projectId: ProjectId): Promise<Task[]> => {
    const result = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), isNull(tasks.deletedAt)))
      .orderBy(tasks.createdAt)
    return result.map(toDomainTask)
  }

const findTasksByUserId =
  ({ db }: Dependencies) =>
  async (userId: UserId, filters?: TaskFilters): Promise<Task[]> => {
    const conditions = [eq(tasks.userId, userId), isNull(tasks.deletedAt)]

    if (filters?.projectId) {
      conditions.push(eq(tasks.projectId, filters.projectId))
    }

    if (filters?.status) {
      conditions.push(eq(tasks.status, filters.status))
    }

    if (filters?.dueBefore) {
      conditions.push(lte(tasks.dueDate, filters.dueBefore))
    }

    if (filters?.search) {
      const searchCondition = or(
        ilike(tasks.title, `%${filters.search}%`),
        ilike(tasks.description, `%${filters.search}%`),
      )
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }

    const query = db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(tasks.createdAt)

    if (filters?.limit) {
      const offset = filters.page ? (filters.page - 1) * filters.limit : 0
      const result = await query.limit(filters.limit).offset(offset)
      return result.map(toDomainTask)
    }

    const result = await query
    return result.map(toDomainTask)
  }

const findTaskChildren =
  ({ db }: Dependencies) =>
  async (taskId: TaskId): Promise<Task[]> => {
    const result = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.parentTaskId, taskId), isNull(tasks.deletedAt)))
      .orderBy(tasks.createdAt)
    return result.map(toDomainTask)
  }

const createTask =
  ({ db }: Dependencies) =>
  async (data: CreateTaskData): Promise<Task> => {
    const result = await db
      .insert(tasks)
      .values({
        userId: data.userId,
        projectId: data.projectId,
        parentTaskId: data.parentTaskId,
        title: data.title,
        description: data.description,
        status: "pending",
        priority: data.priority ?? 0,
        dueDate: data.dueDate,
        depth: 0, // Will be calculated based on parent
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
    return toDomainTask(result[0])
  }

const updateTask =
  ({ db }: Dependencies) =>
  async (id: TaskId, data: UpdateTaskData): Promise<Task | null> => {
    const result = await db
      .update(tasks)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning()
    return result[0] ? toDomainTask(result[0]) : null
  }

const markTaskCompleted =
  ({ db }: Dependencies) =>
  async (id: TaskId): Promise<Task | null> => {
    const result = await db
      .update(tasks)
      .set({
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning()
    return result[0] ? toDomainTask(result[0]) : null
  }

const deleteTask =
  ({ db }: Dependencies) =>
  async (id: TaskId): Promise<boolean> => {
    const result = await db
      .update(tasks)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning()
    return result.length > 0
  }

// Create a repository object that implements TaskRepository interface
export const createTaskRepository = (deps: Dependencies): TaskRepository => ({
  findById: findTaskById(deps),
  findByProjectId: findTasksByProjectId(deps),
  findByUserId: findTasksByUserId(deps),
  findChildren: findTaskChildren(deps),
  create: createTask(deps),
  update: updateTask(deps),
  markCompleted: markTaskCompleted(deps),
  delete: deleteTask(deps),
})
