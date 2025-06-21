import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator as zValidator } from "hono-openapi/zod"
import { z } from "zod"
import type { CreateTaskData, UpdateTaskData } from "@/domain/entities/task"
import type { UserId } from "@/domain/entities/user"
import type { TaskFilters } from "@/domain/repositories/task"
import {
  completeTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasksByUser,
  updateTask,
} from "@/domain/use-cases/task"
import type { Dependencies } from "@/presentation/dependencies"
import {
  ApiErrorSchema,
  ApiResponseSchema,
  CreateTaskSchema,
  IdSchema,
  PaginatedResponseSchema,
  TaskFilterSchema,
  TaskSchema,
  UpdateTaskSchema,
} from "@/presentation/schema"

export const createTaskRoutes = (deps: Dependencies) => {
  const taskRoutes = new Hono()

  // GET /tasks - List tasks with filtering
  taskRoutes.get(
    "/",
    describeRoute({
      tags: ["tasks"],
      summary: "List tasks",
      description: "Get a paginated list of tasks with optional filtering",
      responses: {
        200: {
          description: "List of tasks",
          content: {
            "application/json": {
              schema: resolver(PaginatedResponseSchema(TaskSchema)),
            },
          },
        },
        400: {
          description: "Invalid request parameters",
          content: {
            "application/json": {
              schema: resolver(ApiErrorSchema),
            },
          },
        },
      },
    }),
    zValidator("query", TaskFilterSchema),
    async (c) => {
      const filters = c.req.valid("query")

      try {
        const userId = 1 as UserId // TODO: Get from authenticated user
        const taskFilters: TaskFilters = {
          projectId: filters.projectId,
          status: filters.status,
          search: filters.search,
          page: filters.page ?? 1,
          limit: filters.limit ?? 50,
        }

        const tasks = await getTasksByUser(deps, userId, taskFilters)

        return c.json({
          data: tasks,
          total: tasks.length, // TODO: Implement proper count
          page: filters.page ?? 1,
          limit: filters.limit ?? 50,
          totalPages: Math.ceil(tasks.length / (filters.limit ?? 50)),
          success: true,
        })
      } catch (error) {
        return c.json(
          {
            success: false,
            error: "Failed to fetch tasks",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500,
        )
      }
    },
  )

  // POST /tasks - Create new task
  taskRoutes.post(
    "/",
    describeRoute({
      tags: ["tasks"],
      summary: "Create task",
      description: "Create a new task",
      responses: {
        201: {
          description: "Task created successfully",
          content: {
            "application/json": {
              schema: resolver(ApiResponseSchema(TaskSchema)),
            },
          },
        },
        400: {
          description: "Invalid request data",
          content: {
            "application/json": {
              schema: resolver(ApiErrorSchema),
            },
          },
        },
      },
    }),
    zValidator("json", CreateTaskSchema),
    async (c) => {
      const data = c.req.valid("json")

      try {
        const userId = 1 as UserId // TODO: Get from authenticated user

        const taskData: CreateTaskData = {
          userId,
          projectId: data.projectId,
          parentTaskId: data.parentId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        }

        const task = await createTask(deps, taskData)

        return c.json(
          {
            data: task,
            success: true,
            message: "Task created successfully",
          },
          201,
        )
      } catch (error) {
        return c.json(
          {
            success: false,
            error: "Failed to create task",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500,
        )
      }
    },
  )

  // GET /tasks/:id - Get task with details
  taskRoutes.get(
    "/:id",
    describeRoute({
      tags: ["tasks"],
      summary: "Get task",
      description: "Get a specific task by ID",
      responses: {
        200: {
          description: "Task details",
          content: {
            "application/json": {
              schema: resolver(ApiResponseSchema(TaskSchema)),
            },
          },
        },
        404: {
          description: "Task not found",
          content: {
            "application/json": {
              schema: resolver(ApiErrorSchema),
            },
          },
        },
      },
    }),
    zValidator("param", z.object({ id: IdSchema })),
    async (c) => {
      const { id } = c.req.valid("param")

      try {
        const task = await getTaskById(deps, id)

        if (!task) {
          return c.json(
            {
              success: false,
              error: "Task not found",
              message: `Task with ID ${id} not found`,
            },
            404,
          )
        }

        return c.json({
          data: task,
          success: true,
        })
      } catch (error) {
        return c.json(
          {
            success: false,
            error: "Failed to fetch task",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500,
        )
      }
    },
  )

  // PUT /tasks/:id - Update task
  taskRoutes.put(
    "/:id",
    describeRoute({
      tags: ["tasks"],
      summary: "Update task",
      description: "Update an existing task",
      responses: {
        200: {
          description: "Task updated successfully",
          content: {
            "application/json": {
              schema: resolver(ApiResponseSchema(TaskSchema)),
            },
          },
        },
        404: {
          description: "Task not found",
          content: {
            "application/json": {
              schema: resolver(ApiErrorSchema),
            },
          },
        },
      },
    }),
    zValidator("param", z.object({ id: IdSchema })),
    zValidator("json", UpdateTaskSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const data = c.req.valid("json")

      try {
        const userId = 1 as UserId // TODO: Get from authenticated user

        const updateData: UpdateTaskData = {
          parentTaskId: data.parentId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        }

        const task = await updateTask(deps, id, updateData, userId)

        if (!task) {
          return c.json(
            {
              success: false,
              error: "Task not found",
              message: `Task with ID ${id} not found`,
            },
            404,
          )
        }

        return c.json({
          data: task,
          success: true,
          message: "Task updated successfully",
        })
      } catch (error) {
        return c.json(
          {
            success: false,
            error: "Failed to update task",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500,
        )
      }
    },
  )

  // POST /tasks/:id/complete - Mark task complete
  taskRoutes.post(
    "/:id/complete",
    describeRoute({
      tags: ["tasks"],
      summary: "Complete task",
      description: "Mark a task as completed",
      responses: {
        200: {
          description: "Task completed successfully",
          content: {
            "application/json": {
              schema: resolver(ApiResponseSchema(TaskSchema)),
            },
          },
        },
        404: {
          description: "Task not found",
          content: {
            "application/json": {
              schema: resolver(ApiErrorSchema),
            },
          },
        },
      },
    }),
    zValidator("param", z.object({ id: IdSchema })),
    async (c) => {
      const { id } = c.req.valid("param")

      try {
        const userId = 1 as UserId // TODO: Get from authenticated user
        const task = await completeTask(deps, id, userId)

        if (!task) {
          return c.json(
            {
              success: false,
              error: "Task not found",
              message: `Task with ID ${id} not found`,
            },
            404,
          )
        }

        return c.json({
          data: task,
          success: true,
          message: "Task completed successfully",
        })
      } catch (error) {
        return c.json(
          {
            success: false,
            error: "Failed to complete task",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500,
        )
      }
    },
  )

  // DELETE /tasks/:id - Delete task
  taskRoutes.delete(
    "/:id",
    describeRoute({
      tags: ["tasks"],
      summary: "Delete task",
      description: "Soft delete a task",
      responses: {
        200: {
          description: "Task deleted successfully",
          content: {
            "application/json": {
              schema: resolver(
                ApiResponseSchema(
                  z.object({
                    success: z.boolean(),
                  }),
                ),
              ),
            },
          },
        },
        404: {
          description: "Task not found",
          content: {
            "application/json": {
              schema: resolver(ApiErrorSchema),
            },
          },
        },
      },
    }),
    zValidator("param", z.object({ id: IdSchema })),
    async (c) => {
      const { id } = c.req.valid("param")

      try {
        const userId = 1 as UserId // TODO: Get from authenticated user
        await deleteTask(deps, id, userId)

        return c.json({
          data: { success: true },
          success: true,
          message: "Task deleted successfully",
        })
      } catch (error) {
        return c.json(
          {
            success: false,
            error: "Failed to delete task",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          500,
        )
      }
    },
  )

  return taskRoutes
}
