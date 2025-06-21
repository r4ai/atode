import { Hono } from "hono"
import { vValidator } from "@hono/valibot-validator"
import { describeRoute } from "hono-openapi"
import { resolver } from "hono-openapi/valibot"
import * as v from "valibot"
import {
  TaskSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskFilterSchema,
  ApiResponseSchema,
  PaginatedResponseSchema,
  ApiErrorSchema,
  IdSchema,
} from "../schema"
import { dependencies } from "../dependencies"
import {
  getTask,
  createTask,
  updateTask,
  getTasks,
  completeTask,
  deleteTask,
} from "../controllers/task"

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
  vValidator("query", TaskFilterSchema),
  getTasks(dependencies),
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
  vValidator("json", CreateTaskSchema),
  createTask(dependencies),
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
  vValidator("param", v.object({ id: IdSchema })),
  getTask(dependencies),
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
  vValidator("param", v.object({ id: IdSchema })),
  vValidator("json", UpdateTaskSchema),
  updateTask(dependencies),
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
  vValidator("param", v.object({ id: IdSchema })),
  completeTask(dependencies),
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
                v.object({
                  success: v.boolean(),
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
  vValidator("param", v.object({ id: IdSchema })),
  deleteTask(dependencies),
)

export { taskRoutes }
