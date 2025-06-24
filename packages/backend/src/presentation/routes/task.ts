import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator as zValidator } from "hono-openapi/zod"
import { z } from "zod"
import type { CreateTaskData, UpdateTaskData } from "@/domain/entities/task"
import type { TaskFilters } from "@/domain/repositories/task"
import {
  completeTask,
  countTasks,
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "@/domain/use-cases/task"
import type { Dependencies } from "@/presentation/dependencies"
import {
  ApiErrorSchema,
  ApiResponseSchema,
  CreateTaskSchema,
  IdParamSchema,
  PaginatedResponseSchema,
  TaskFilterSchema,
  TaskSchema,
  UpdateTaskSchema,
} from "@/presentation/schema"

export const createTaskRoutes = (deps: Dependencies) => {
  const taskRoutes = new Hono()

    // GET /tasks - List tasks with filtering
    .get(
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
          const session = c.get("authUser")
          if (!session?.user?.email) {
            return c.json(
              {
                success: false,
                error: "Unauthorized",
                message: "User not authenticated",
              } as const,
              401,
            )
          }

          // Get user from database to get the ID
          const user = await deps.repository.user.findByEmail(
            session.user.email,
          )
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const taskFilters: TaskFilters = {
            projectId: filters?.projectId,
            status: filters?.status,
            search: filters?.search,
            page: filters?.page ?? 1,
            limit: filters?.limit ?? 50,
          }

          const [tasks, totalCount] = await Promise.all([
            getTasks(deps, { userId: user.id, filters: taskFilters }),
            countTasks(deps, {
              userId: user.id,
              filters: {
                projectId: filters?.projectId,
                status: filters?.status,
                search: filters?.search,
              },
            }),
          ])

          const limit = filters?.limit ?? 50
          const totalPages = Math.ceil(totalCount / limit)

          return c.json({
            data: tasks,
            total: totalCount,
            page: filters?.page ?? 1,
            limit,
            totalPages,
            success: true,
          } as const)
        } catch (error) {
          return c.json(
            {
              success: false,
              error: "Failed to fetch tasks",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // POST /tasks - Create new task
    .post(
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
          const session = c.get("authUser")
          if (!session?.user?.email) {
            return c.json(
              {
                success: false,
                error: "Unauthorized",
                message: "User not authenticated",
              } as const,
              401,
            )
          }

          // Get user from database to get the ID
          const user = await deps.repository.user.findByEmail(
            session.user.email,
          )
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const taskData: CreateTaskData = {
            userId: user.id,
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
            } as const,
            201,
          )
        } catch (error) {
          return c.json(
            {
              success: false,
              error: "Failed to create task",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // GET /tasks/:id - Get task with details
    .get(
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
      zValidator("param", z.object({ id: IdParamSchema })),
      async (c) => {
        const { id } = c.req.valid("param")

        try {
          const session = c.get("authUser")
          if (!session?.user?.email) {
            return c.json(
              {
                success: false,
                error: "Unauthorized",
                message: "User not authenticated",
              } as const,
              401,
            )
          }

          // Get user from database to get the ID
          const user = await deps.repository.user.findByEmail(
            session.user.email,
          )
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const task = await getTask(deps, id)

          if (!task || task.userId !== user.id) {
            return c.json(
              {
                success: false,
                error: "Task not found",
                message: `Task with ID ${id} not found`,
              } as const,
              404,
            )
          }

          return c.json({
            data: task,
            success: true,
          } as const)
        } catch (error) {
          return c.json(
            {
              success: false,
              error: "Failed to fetch task",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // PUT /tasks/:id - Update task
    .put(
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
      zValidator("param", z.object({ id: IdParamSchema })),
      zValidator("json", UpdateTaskSchema),
      async (c) => {
        // Check authentication first
        const session = c.get("authUser")
        if (!session?.user?.email) {
          return c.json(
            {
              success: false,
              error: "Unauthorized",
              message: "User not authenticated",
            } as const,
            401,
          )
        }

        const { id: idParam } = c.req.valid("param")
        const data = c.req.valid("json")

        // Convert to number and validate
        const id = Number(idParam)
        if (Number.isNaN(id) || id <= 0) {
          return c.json(
            {
              success: false,
              error: "Task not found",
              message: `Task with ID ${idParam} not found`,
            } as const,
            404,
          )
        }

        try {
          // Get user from database to get the ID
          const user = await deps.repository.user.findByEmail(
            session.user.email,
          )
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const updateData: UpdateTaskData = {
            parentTaskId: data.parentId,
            title: data.title,
            description: data.description,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          }

          const task = await updateTask(deps, id, updateData, user.id)

          return c.json({
            data: task,
            success: true,
            message: "Task updated successfully",
          } as const)
        } catch (error) {
          if (error instanceof Error && error.message === "Task not found") {
            return c.json(
              {
                success: false,
                error: "Task not found",
                message: `Task with ID ${id} not found`,
              } as const,
              404,
            )
          }

          return c.json(
            {
              success: false,
              error: "Failed to update task",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // POST /tasks/:id/complete - Mark task complete
    .post(
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
      zValidator("param", z.object({ id: IdParamSchema })),
      async (c) => {
        const { id } = c.req.valid("param")

        // Check authentication first
        const session = c.get("authUser")
        if (!session?.user?.email) {
          return c.json(
            {
              success: false,
              error: "Unauthorized",
              message: "User not authenticated",
            } as const,
            401,
          )
        }

        try {
          // Get user from database to get the ID
          const user = await deps.repository.user.findByEmail(
            session.user.email,
          )
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const task = await completeTask(deps, id, user.id)

          return c.json({
            data: task,
            success: true,
            message: "Task completed successfully",
          } as const)
        } catch (error) {
          if (error instanceof Error && error.message === "Task not found") {
            return c.json(
              {
                success: false,
                error: "Task not found",
                message: `Task with ID ${id} not found`,
              } as const,
              404,
            )
          }

          return c.json(
            {
              success: false,
              error: "Failed to complete task",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // DELETE /tasks/:id - Delete task
    .delete(
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
      zValidator("param", z.object({ id: IdParamSchema })),
      async (c) => {
        const { id } = c.req.valid("param")

        // Check authentication first
        const session = c.get("authUser")
        if (!session?.user?.email) {
          return c.json(
            {
              success: false,
              error: "Unauthorized",
              message: "User not authenticated",
            } as const,
            401,
          )
        }

        try {
          // Get user from database to get the ID
          const user = await deps.repository.user.findByEmail(
            session.user.email,
          )
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          await deleteTask(deps, id, user.id)

          return c.json({
            data: { success: true },
            success: true,
            message: "Task deleted successfully",
          } as const)
        } catch (error) {
          if (error instanceof Error && error.message === "Task not found") {
            return c.json(
              {
                success: false,
                error: "Failed to delete task",
                message: `Task with ID ${id} not found`,
              } as const,
              500,
            )
          }

          return c.json(
            {
              success: false,
              error: "Failed to delete task",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

  return taskRoutes
}
