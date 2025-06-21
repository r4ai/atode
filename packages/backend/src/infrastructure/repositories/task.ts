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
import { db } from "@/infrastructure/database/connection"
import { tasks } from "@/infrastructure/database/schema"

export const findTaskById = async (id: TaskId): Promise<Task | null> => {
  const result = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), isNull(tasks.deletedAt)))
  return (result[0] as Task) ?? null
}

export const findTasksByProjectId = async (
  projectId: ProjectId,
): Promise<Task[]> => {
  const result = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.projectId, projectId), isNull(tasks.deletedAt)))
    .orderBy(tasks.createdAt)
  return result as Task[]
}

export const findTasksByUserId = async (
  userId: UserId,
  filters?: TaskFilters,
): Promise<Task[]> => {
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
    return result as Task[]
  }

  const result = await query
  return result as Task[]
}

export const findTaskChildren = async (taskId: TaskId): Promise<Task[]> => {
  const result = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.parentTaskId, taskId), isNull(tasks.deletedAt)))
    .orderBy(tasks.createdAt)
  return result as Task[]
}

export const createTask = async (data: CreateTaskData): Promise<Task> => {
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
  return (result as any[])[0] as Task
}

export const updateTask = async (
  id: TaskId,
  data: UpdateTaskData,
): Promise<Task | null> => {
  const result = await db
    .update(tasks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id))
    .returning()
  return ((result as any[])[0] as Task) ?? null
}

export const markTaskCompleted = async (id: TaskId): Promise<Task | null> => {
  const result = await db
    .update(tasks)
    .set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id))
    .returning()
  return ((result as any[])[0] as Task) ?? null
}

export const deleteTask = async (id: TaskId): Promise<boolean> => {
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
export const taskRepository: TaskRepository = {
  findById: findTaskById,
  findByProjectId: findTasksByProjectId,
  findByUserId: findTasksByUserId,
  findChildren: findTaskChildren,
  create: createTask,
  update: updateTask,
  markCompleted: markTaskCompleted,
  delete: deleteTask,
}
