import { and, count, eq, ilike, isNull, lte, or } from "drizzle-orm"
import type {
  CreateTaskData,
  Task,
  TaskId,
  UpdateTaskData,
} from "@/domain/entities/task"
import type { UserId } from "@/domain/entities/user"
import type {
  FindOptions,
  TaskFilters,
  TaskRepository,
} from "@/domain/repositories/task"
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

const buildFindConditions = (options: FindOptions) => {
  const conditions = []

  // Handle deleted tasks
  if (!options.includeDeleted) {
    conditions.push(isNull(tasks.deletedAt))
  }

  // Handle the union type - exactly one of id, userId, or projectId must be present
  if ("id" in options && options.id) {
    conditions.push(eq(tasks.id, options.id))
  }
  if ("userId" in options && options.userId) {
    conditions.push(eq(tasks.userId, options.userId))
  }
  if ("projectId" in options && options.projectId) {
    conditions.push(eq(tasks.projectId, options.projectId))
  }

  // Handle parent task ID
  if (options.parentTaskId) {
    conditions.push(eq(tasks.parentTaskId, options.parentTaskId))
  }

  // Handle filters
  if (options.filters) {
    const { filters } = options

    if (filters.projectId) {
      conditions.push(eq(tasks.projectId, filters.projectId))
    }

    if (filters.status) {
      conditions.push(eq(tasks.status, filters.status))
    }

    if (filters.dueBefore) {
      conditions.push(lte(tasks.dueDate, filters.dueBefore))
    }

    if (filters.search) {
      const searchCondition = or(
        ilike(tasks.title, `%${filters.search}%`),
        ilike(tasks.description, `%${filters.search}%`),
      )
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }
  }

  return conditions
}

const findTasks =
  ({ db }: Dependencies) =>
  async (options: FindOptions): Promise<Task[]> => {
    const conditions = buildFindConditions(options)

    const query = db
      .select()
      .from(tasks)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(tasks.createdAt)

    // Handle pagination
    if (options.filters?.limit) {
      const offset = options.filters.page
        ? (options.filters.page - 1) * options.filters.limit
        : 0
      const result = await query.limit(options.filters.limit).offset(offset)
      return result.map(toDomainTask)
    }

    const result = await query
    return result.map(toDomainTask)
  }

const countTasks =
  ({ db }: Dependencies) =>
  async (
    userId: UserId,
    filters?: Omit<TaskFilters, "page" | "limit">,
  ): Promise<number> => {
    const conditions = buildFindConditions({ userId, filters })

    const result = await db
      .select({ count: count() })
      .from(tasks)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    return result[0]?.count ?? 0
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
  find: findTasks(deps),
  count: countTasks(deps),
  findChildren: findTaskChildren(deps),
  create: createTask(deps),
  update: updateTask(deps),
  markCompleted: markTaskCompleted(deps),
  delete: deleteTask(deps),
})
