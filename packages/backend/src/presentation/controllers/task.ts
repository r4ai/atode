import type { Context } from "hono"
import type {
  CreateTaskData,
  TaskId,
  UpdateTaskData,
} from "../../domain/entities/task"
import type { UserId } from "../../domain/entities/user"
import type { TaskFilters } from "../../domain/repositories/task"
import * as taskUseCases from "../../domain/use-cases/task"
import type { Dependencies } from "../dependencies"

export const getTasks = (deps: Dependencies) => async (c: Context) => {
  try {
    const userId = Number(c.get("userId")) as UserId // Assuming auth middleware sets this
    const filters: TaskFilters = {
      projectId: c.req.query("project_id")
        ? Number(c.req.query("project_id"))
        : undefined,
      status: c.req.query("status") as any,
      search: c.req.query("search"),
      page: c.req.query("page") ? Number(c.req.query("page")) : undefined,
      limit: c.req.query("limit") ? Number(c.req.query("limit")) : undefined,
    }

    const tasks = await taskUseCases.getTasksByUser(deps, userId, filters)

    return c.json({
      data: tasks,
      status: "success",
    })
  } catch (error) {
    return c.json(
      {
        error: "Failed to fetch tasks",
        message: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      500,
    )
  }
}

export const getTask = (deps: Dependencies) => async (c: Context) => {
  try {
    const id = Number(c.req.param("id")) as TaskId
    const task = await taskUseCases.getTaskById(deps, id)

    if (!task) {
      return c.json(
        {
          error: "Not Found",
          message: "Task not found",
          status: "error",
        },
        404,
      )
    }

    return c.json({
      data: task,
      status: "success",
    })
  } catch (error) {
    return c.json(
      {
        error: "Failed to fetch task",
        message: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      500,
    )
  }
}

export const createTask = (deps: Dependencies) => async (c: Context) => {
  try {
    const userId = Number(c.get("userId")) as UserId
    const body = await c.req.json()

    const taskData: CreateTaskData = {
      userId,
      projectId: body.project_id,
      parentTaskId: body.parent_task_id,
      title: body.title,
      description: body.description,
      priority: body.priority,
      dueDate: body.due_date ? new Date(body.due_date) : undefined,
    }

    const task = await taskUseCases.createTask(deps, taskData)

    return c.json(
      {
        data: task,
        status: "success",
      },
      201,
    )
  } catch (error) {
    return c.json(
      {
        error: "Failed to create task",
        message: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      400,
    )
  }
}

export const updateTask = (deps: Dependencies) => async (c: Context) => {
  try {
    const id = Number(c.req.param("id")) as TaskId
    const userId = Number(c.get("userId")) as UserId
    const body = await c.req.json()

    const updateData: UpdateTaskData = {
      parentTaskId: body.parent_task_id,
      title: body.title,
      description: body.description,
      priority: body.priority,
      dueDate: body.due_date ? new Date(body.due_date) : undefined,
    }

    const task = await taskUseCases.updateTask(deps, id, updateData, userId)

    return c.json({
      data: task,
      status: "success",
    })
  } catch (error) {
    return c.json(
      {
        error: "Failed to update task",
        message: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      400,
    )
  }
}

export const completeTask = (deps: Dependencies) => async (c: Context) => {
  try {
    const id = Number(c.req.param("id")) as TaskId
    const userId = Number(c.get("userId")) as UserId

    const task = await taskUseCases.completeTask(deps, id, userId)

    return c.json({
      data: task,
      status: "success",
    })
  } catch (error) {
    return c.json(
      {
        error: "Failed to complete task",
        message: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      400,
    )
  }
}

export const deleteTask = (deps: Dependencies) => async (c: Context) => {
  try {
    const id = Number(c.req.param("id")) as TaskId
    const userId = Number(c.get("userId")) as UserId

    await taskUseCases.deleteTask(deps, id, userId)

    return c.json({
      data: { success: true },
      status: "success",
    })
  } catch (error) {
    return c.json(
      {
        error: "Failed to delete task",
        message: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      400,
    )
  }
}
