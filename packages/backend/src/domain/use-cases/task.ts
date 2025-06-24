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

export const getTaskById = async (
  deps: TaskDependencies,
  id: TaskId,
): Promise<Task | null> => {
  const results = await deps.repository.task.find({ id })
  return results[0] ?? null
}

export const getTasksByProject = async (
  deps: TaskDependencies,
  projectId: ProjectId,
): Promise<Task[]> => {
  return await deps.repository.task.find({ projectId })
}

export const getTasksByUser = async (
  deps: TaskDependencies,
  userId: UserId,
  filters?: TaskFilters,
): Promise<Task[]> => {
  return await deps.repository.task.find({ userId, filters })
}

export const getTasksCountByUser = async (
  deps: TaskDependencies,
  userId: UserId,
  filters?: Omit<TaskFilters, "page" | "limit">,
): Promise<number> => {
  return await deps.repository.task.count(userId, filters)
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
    const parentTasks = await deps.repository.task.find({
      id: data.parentTaskId,
    })
    const parentTask = parentTasks[0]
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
  const tasks = await deps.repository.task.find({ id })
  const task = tasks[0]
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
  const tasks = await deps.repository.task.find({ id })
  const task = tasks[0]
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
  const tasks = await deps.repository.task.find({ id })
  const task = tasks[0]
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
