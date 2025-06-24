import type { ProjectId } from "@/domain/entities/project"
import type {
  CreateTaskData,
  Task,
  TaskId,
  UpdateTaskData,
} from "@/domain/entities/task"
import type { UserId } from "@/domain/entities/user"
import type { ProjectRepository } from "@/domain/repositories/project"
import type { TaskFilters, TaskRepository } from "@/domain/repositories/task"

type TaskDependencies = {
  repository: {
    task: TaskRepository
    project: ProjectRepository
  }
}

export const getTask = async (
  deps: TaskDependencies,
  id: TaskId,
  filters?: TaskFilters,
): Promise<Task | null> => {
  const tasks = await deps.repository.task.find({ id, filters })
  return tasks[0] ?? null
}

type GetTasksOptions =
  | { projectId: ProjectId; filters?: TaskFilters }
  | { userId: UserId; filters?: TaskFilters }

export const getTasks = async (
  deps: TaskDependencies,
  options: GetTasksOptions,
): Promise<Task[]> => {
  if ("projectId" in options) {
    return await deps.repository.task.find({
      projectId: options.projectId,
      filters: options.filters,
    })
  }
  return await deps.repository.task.find({
    userId: options.userId,
    filters: options.filters,
  })
}

type CountTasksOptions =
  | { userId: UserId; filters?: Omit<TaskFilters, "page" | "limit"> }
  | { projectId: ProjectId; filters?: Omit<TaskFilters, "page" | "limit"> }

export const countTasks = async (
  deps: TaskDependencies,
  options: CountTasksOptions,
): Promise<number> => {
  if ("userId" in options) {
    return await deps.repository.task.count(options.userId, options.filters)
  }
  // For projectId, we can use the find method with filters and count the results
  const tasks = await deps.repository.task.find({
    projectId: options.projectId,
    filters: options.filters,
  })
  return tasks.length
}

export const createTask = async (
  deps: TaskDependencies,
  data: CreateTaskData,
): Promise<Task> => {
  // Business logic: Verify project exists and user has access
  const project = await deps.repository.project.findById(data.projectId)
  if (!project) {
    throw new Error("Project not found")
  }

  if (project.userId !== data.userId) {
    throw new Error("User does not have access to this project")
  }

  // Business logic: Verify parent task exists and belongs to same project
  if (data.parentTaskId) {
    const parentTask = await getTask(deps, data.parentTaskId)
    if (!parentTask) {
      throw new Error("Parent task not found")
    }
    if (parentTask.projectId !== data.projectId) {
      throw new Error("Parent task must belong to the same project")
    }
  }

  return await deps.repository.task.create(data)
}

export const updateTask = async (
  deps: TaskDependencies,
  id: TaskId,
  data: UpdateTaskData,
  userId: UserId,
): Promise<Task> => {
  const task = await getTask(deps, id)
  if (!task) {
    throw new Error("Task not found")
  }

  if (task.userId !== userId) {
    throw new Error("Task not found")
  }

  const updatedTask = await deps.repository.task.update(id, data)
  if (!updatedTask) {
    throw new Error("Failed to update task")
  }

  return updatedTask
}

export const completeTask = async (
  deps: TaskDependencies,
  id: TaskId,
  userId: UserId,
): Promise<Task> => {
  const task = await getTask(deps, id)
  if (!task) {
    throw new Error("Task not found")
  }

  if (task.userId !== userId) {
    throw new Error("Task not found")
  }

  if (task.status === "completed") {
    throw new Error("Task is already completed")
  }

  const completedTask = await deps.repository.task.markCompleted(id)
  if (!completedTask) {
    throw new Error("Failed to complete task")
  }

  return completedTask
}

export const deleteTask = async (
  deps: TaskDependencies,
  id: TaskId,
  userId: UserId,
): Promise<void> => {
  const task = await getTask(deps, id)
  if (!task) {
    throw new Error("Task not found")
  }

  if (task.userId !== userId) {
    throw new Error("Task not found")
  }

  const deleted = await deps.repository.task.delete(id)
  if (!deleted) {
    throw new Error("Failed to delete task")
  }
}
