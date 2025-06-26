import { z } from "zod"
import "zod-openapi/extend"

// Base schemas with ref for reusability
export const IdSchema = z.coerce.number().int().min(1).openapi({
  example: 1,
  description: "Unique identifier",
  ref: "Id",
})

export const IdParamSchema = z
  .string()
  .transform((val) => Number(val))
  .pipe(IdSchema)
  .openapi({
    example: "1",
    description: "Unique identifier as URL parameter",
    ref: "IdParam",
  })

export const TimestampSchema = z
  .union([z.date(), z.string().datetime()])
  .openapi({
    example: "2025-01-01T00:00:00Z",
    description: "ISO timestamp",
    ref: "Timestamp",
  })

export const ColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .openapi({
    example: "#FF5722",
    description: "Hex color code",
    ref: "Color",
  })

// User schemas
export const UserSchema = z
  .object({
    id: IdSchema,
    email: z.string().email().openapi({ example: "user@example.com" }),
    displayName: z.string().min(1).max(255).openapi({ example: "John Doe" }),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    deletedAt: TimestampSchema.nullable().optional(),
  })
  .openapi({
    description: "User entity",
    ref: "User",
  })

export const CreateUserSchema = z
  .object({
    email: z.string().email().openapi({ example: "user@example.com" }),
    displayName: z.string().min(1).max(255).openapi({ example: "John Doe" }),
  })
  .openapi({
    description: "Create user request",
    ref: "CreateUser",
  })

// Project schemas
export const ProjectSchema = z
  .object({
    id: IdSchema,
    userId: IdSchema,
    parentProjectId: IdSchema.nullable().optional(),
    name: z.string().min(1).max(255).openapi({ example: "My Project" }),
    description: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "Project description" }),
    color: ColorSchema.optional(),
    path: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "/root/subproject" }),
    depth: z.coerce.number().int().min(0).openapi({ example: 0 }),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    deletedAt: TimestampSchema.nullable().optional(),
  })
  .openapi({
    description: "Project entity",
    ref: "Project",
  })

export const CreateProjectSchema = z
  .object({
    name: z.string().min(1).max(255).openapi({ example: "My Project" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Project description" }),
    parentId: IdSchema.optional(),
    color: ColorSchema.optional(),
  })
  .openapi({
    description: "Create project request",
    ref: "CreateProject",
  })

export const UpdateProjectSchema = CreateProjectSchema.partial().openapi({
  description: "Update project request",
  ref: "UpdateProject",
})

// Task schemas
export const TaskStatusSchema = z
  .enum(["pending", "in_progress", "completed", "cancelled"])
  .openapi({
    example: "pending",
    description: "Task status",
    ref: "TaskStatus",
  })

export const TaskSchema = z
  .object({
    id: IdSchema,
    userId: IdSchema,
    projectId: IdSchema,
    parentTaskId: IdSchema.nullable().optional(),
    title: z.string().min(1).max(500).openapi({ example: "Complete task" }),
    description: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "Task description" }),
    status: TaskStatusSchema,
    priority: z.coerce.number().int().openapi({
      example: 1,
      description: "Task priority (higher = more important)",
    }),
    dueDate: TimestampSchema.nullable().optional(),
    completedAt: TimestampSchema.nullable().optional(),
    path: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "/root/subtask" }),
    depth: z.coerce.number().int().min(0).openapi({ example: 0 }),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    deletedAt: TimestampSchema.nullable().optional(),
  })
  .openapi({
    description: "Task entity",
    ref: "Task",
  })

export const CreateTaskSchema = z
  .object({
    title: z.string().min(1).max(500).openapi({ example: "Complete task" }),
    projectId: IdSchema,
    parentId: IdSchema.optional(),
    description: z.string().optional().openapi({ example: "Task description" }),
    priority: z.coerce.number().int().optional().openapi({ example: 1 }),
    dueDate: TimestampSchema.optional(),
    labels: z
      .array(z.string())
      .optional()
      .openapi({ example: ["urgent", "bug"] }),
  })
  .openapi({
    description: "Create task request",
    ref: "CreateTask",
  })

export const UpdateTaskSchema = CreateTaskSchema.omit({ projectId: true })
  .partial()
  .openapi({
    description: "Update task request",
    ref: "UpdateTask",
  })

// Label schemas
export const LabelSchema = z
  .object({
    id: IdSchema,
    userId: IdSchema,
    name: z.string().min(1).max(100).openapi({ example: "urgent" }),
    color: ColorSchema.optional(),
    createdAt: TimestampSchema,
  })
  .openapi({
    description: "Label entity",
    ref: "Label",
  })

export const CreateLabelSchema = z
  .object({
    name: z.string().min(1).max(100).openapi({ example: "urgent" }),
    color: ColorSchema.optional(),
  })
  .openapi({
    description: "Create label request",
    ref: "CreateLabel",
  })

// Comment schemas
export const CommentSchema = z
  .object({
    id: IdSchema,
    userId: IdSchema,
    commentableType: z.string().min(1).max(50).openapi({
      example: "task",
      description: "Type of entity being commented on",
    }),
    commentableId: IdSchema,
    parentCommentId: IdSchema.nullable().optional(),
    content: z.string().min(1).openapi({ example: "This is a comment" }),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    deletedAt: TimestampSchema.nullable().optional(),
  })
  .openapi({
    description: "Comment entity",
    ref: "Comment",
  })

export const CreateCommentSchema = z
  .object({
    content: z.string().min(1).openapi({ example: "This is a comment" }),
    parentId: IdSchema.optional(),
  })
  .openapi({
    description: "Create comment request",
    ref: "CreateComment",
  })

// Query parameter schemas
export const PaginationSchema = z
  .object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .optional()
      .openapi({ example: 1, description: "Page number" }),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .openapi({ example: 20, description: "Items per page" }),
  })
  .openapi({
    description: "Pagination parameters",
    ref: "Pagination",
  })

export const TaskFilterSchema = PaginationSchema.extend({
  projectId: IdSchema.optional(),
  status: TaskStatusSchema.optional(),
  labels: z
    .array(z.string())
    .optional()
    .openapi({ example: ["urgent", "bug"] }),
  dueBefore: TimestampSchema.optional(),
  dueAfter: TimestampSchema.optional(),
  search: z.string().optional().openapi({ example: "search term" }),
  includeCompleted: z.boolean().optional().openapi({ example: false }),
})
  .optional()
  .openapi({
    description: "Task filter parameters",
    ref: "TaskFilter",
  })

export const ProjectFilterSchema = PaginationSchema.extend({
  includeArchived: z.boolean().optional().openapi({ example: false }),
  depth: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .openapi({ example: 1, description: "Maximum depth to include" }),
}).openapi({
  description: "Project filter parameters",
  ref: "ProjectFilter",
})

// Response schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z
    .object({
      data: dataSchema,
      success: z.boolean().openapi({ example: true }),
      message: z
        .string()
        .optional()
        .openapi({ example: "Operation completed successfully" }),
    })
    .openapi({
      description: "API response wrapper",
      ref: "ApiResponse",
    })

export const ApiErrorSchema = z
  .object({
    success: z.literal(false),
    error: z.string().openapi({ example: "VALIDATION_ERROR" }),
    message: z.string().openapi({ example: "Invalid input provided" }),
    details: z.unknown().optional(),
  })
  .openapi({
    description: "API error response",
    ref: "ApiError",
  })

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z
    .object({
      data: z.array(itemSchema),
      total: z.coerce
        .number()
        .int()
        .min(0)
        .openapi({ example: 42, description: "Total number of items" }),
      page: z.coerce
        .number()
        .int()
        .min(1)
        .openapi({ example: 1, description: "Current page number" }),
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .openapi({ example: 20, description: "Items per page" }),
      totalPages: z.coerce
        .number()
        .int()
        .min(0)
        .openapi({ example: 3, description: "Total number of pages" }),
      success: z.boolean().openapi({ example: true }),
    })
    .openapi({
      description: "Paginated response wrapper",
      ref: "PaginatedResponse",
    })

// Type exports
export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type Project = z.infer<typeof ProjectSchema>
export type CreateProject = z.infer<typeof CreateProjectSchema>
export type UpdateProject = z.infer<typeof UpdateProjectSchema>
export type Task = z.infer<typeof TaskSchema>
export type CreateTask = z.infer<typeof CreateTaskSchema>
export type UpdateTask = z.infer<typeof UpdateTaskSchema>
export type Label = z.infer<typeof LabelSchema>
export type CreateLabel = z.infer<typeof CreateLabelSchema>
export type Comment = z.infer<typeof CommentSchema>
export type CreateComment = z.infer<typeof CreateCommentSchema>
export type TaskFilter = z.infer<typeof TaskFilterSchema>
export type ProjectFilter = z.infer<typeof ProjectFilterSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>
