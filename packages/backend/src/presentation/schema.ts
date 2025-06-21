import * as v from "valibot"

// Base schemas
export const IdSchema = v.pipe(v.number(), v.integer(), v.minValue(1))
export const TimestampSchema = v.string()
export const ColorSchema = v.pipe(v.string(), v.regex(/^#[0-9A-Fa-f]{6}$/))

// User schemas
export const UserSchema = v.object({
  id: IdSchema,
  email: v.pipe(v.string(), v.email()),
  displayName: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: v.optional(v.nullable(TimestampSchema)),
})

export const CreateUserSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  displayName: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
})

// Project schemas
export const ProjectSchema = v.object({
  id: IdSchema,
  userId: IdSchema,
  parentProjectId: v.optional(v.nullable(IdSchema)),
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
  description: v.optional(v.nullable(v.string())),
  color: v.optional(ColorSchema),
  path: v.optional(v.nullable(v.string())),
  depth: v.pipe(v.number(), v.integer(), v.minValue(0)),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: v.optional(v.nullable(TimestampSchema)),
})

export const CreateProjectSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
  description: v.optional(v.string()),
  parentId: v.optional(IdSchema),
  color: v.optional(ColorSchema),
})

export const UpdateProjectSchema = v.partial(CreateProjectSchema)

// Task schemas
export const TaskStatusSchema = v.union([
  v.literal("pending"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("cancelled"),
])

export const TaskSchema = v.object({
  id: IdSchema,
  userId: IdSchema,
  projectId: IdSchema,
  parentTaskId: v.optional(v.nullable(IdSchema)),
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(500)),
  description: v.optional(v.nullable(v.string())),
  status: TaskStatusSchema,
  priority: v.pipe(v.number(), v.integer()),
  dueDate: v.optional(v.nullable(TimestampSchema)),
  completedAt: v.optional(v.nullable(TimestampSchema)),
  path: v.optional(v.nullable(v.string())),
  depth: v.pipe(v.number(), v.integer(), v.minValue(0)),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: v.optional(v.nullable(TimestampSchema)),
})

export const CreateTaskSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(500)),
  projectId: IdSchema,
  parentId: v.optional(IdSchema),
  description: v.optional(v.string()),
  priority: v.optional(v.pipe(v.number(), v.integer())),
  dueDate: v.optional(TimestampSchema),
  labels: v.optional(v.array(v.string())),
})

export const UpdateTaskSchema = v.partial(
  v.omit(CreateTaskSchema, ["projectId"]),
)

// Label schemas
export const LabelSchema = v.object({
  id: IdSchema,
  userId: IdSchema,
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  color: v.optional(ColorSchema),
  createdAt: TimestampSchema,
})

export const CreateLabelSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  color: v.optional(ColorSchema),
})

// Comment schemas
export const CommentSchema = v.object({
  id: IdSchema,
  userId: IdSchema,
  commentableType: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
  commentableId: IdSchema,
  parentCommentId: v.optional(v.nullable(IdSchema)),
  content: v.pipe(v.string(), v.minLength(1)),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: v.optional(v.nullable(TimestampSchema)),
})

export const CreateCommentSchema = v.object({
  content: v.pipe(v.string(), v.minLength(1)),
  parentId: v.optional(IdSchema),
})

// Query parameter schemas
export const PaginationSchema = v.object({
  page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  limit: v.optional(
    v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
  ),
})

export const TaskFilterSchema = v.object({
  ...PaginationSchema.entries,
  projectId: v.optional(IdSchema),
  status: v.optional(TaskStatusSchema),
  labels: v.optional(v.array(v.string())),
  dueBefore: v.optional(TimestampSchema),
  dueAfter: v.optional(TimestampSchema),
  search: v.optional(v.string()),
  includeCompleted: v.optional(v.boolean()),
})

export const ProjectFilterSchema = v.object({
  ...PaginationSchema.entries,
  includeArchived: v.optional(v.boolean()),
  depth: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
})

// Response schemas
export const ApiResponseSchema = <
  T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(
  dataSchema: T,
) =>
  v.object({
    data: dataSchema,
    success: v.boolean(),
    message: v.optional(v.string()),
  })

export const ApiErrorSchema = v.object({
  success: v.literal(false),
  error: v.string(),
  message: v.string(),
  details: v.optional(v.unknown()),
})

export const PaginatedResponseSchema = <
  T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(
  itemSchema: T,
) =>
  v.object({
    data: v.array(itemSchema),
    total: v.pipe(v.number(), v.integer(), v.minValue(0)),
    page: v.pipe(v.number(), v.integer(), v.minValue(1)),
    limit: v.pipe(v.number(), v.integer(), v.minValue(1)),
    totalPages: v.pipe(v.number(), v.integer(), v.minValue(0)),
    success: v.boolean(),
  })

// Type exports
export type User = v.InferOutput<typeof UserSchema>
export type CreateUser = v.InferOutput<typeof CreateUserSchema>
export type Project = v.InferOutput<typeof ProjectSchema>
export type CreateProject = v.InferOutput<typeof CreateProjectSchema>
export type UpdateProject = v.InferOutput<typeof UpdateProjectSchema>
export type Task = v.InferOutput<typeof TaskSchema>
export type CreateTask = v.InferOutput<typeof CreateTaskSchema>
export type UpdateTask = v.InferOutput<typeof UpdateTaskSchema>
export type Label = v.InferOutput<typeof LabelSchema>
export type CreateLabel = v.InferOutput<typeof CreateLabelSchema>
export type Comment = v.InferOutput<typeof CommentSchema>
export type CreateComment = v.InferOutput<typeof CreateCommentSchema>
export type TaskFilter = v.InferOutput<typeof TaskFilterSchema>
export type ProjectFilter = v.InferOutput<typeof ProjectFilterSchema>
export type ApiError = v.InferOutput<typeof ApiErrorSchema>
