import {
  bigint,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  primaryKey,
  type AnyPgColumn,
} from "drizzle-orm/pg-core"

// Users table
export const users = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// Projects with hierarchical support
export const projects = pgTable("projects", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  userId: bigint("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  parentProjectId: bigint("parent_project_id", { mode: "number" }).references(
    (): AnyPgColumn => projects.id,
    { onDelete: "cascade" },
  ),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#808080"),
  path: text("path"), // LTREE for hierarchical queries
  depth: integer("depth").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// Tasks table with hierarchy and priority support
export const tasks = pgTable("tasks", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  userId: bigint("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  projectId: bigint("project_id", { mode: "number" })
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  parentTaskId: bigint("parent_task_id", { mode: "number" }).references(
    (): AnyPgColumn => tasks.id,
    { onDelete: "cascade" },
  ),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 })
    .notNull()
    .default("pending")
    .$type<"pending" | "in_progress" | "completed" | "cancelled">(),
  priority: integer("priority").notNull().default(0),
  dueDate: timestamp("due_date", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  path: text("path"), // For hierarchical queries using LTREE
  depth: integer("depth").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// Labels/tags system
export const labels = pgTable("labels", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  userId: bigint("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 7 }).default("#808080"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Task-label associations
export const taskLabels = pgTable(
  "task_labels",
  {
    taskId: bigint("task_id", { mode: "number" })
      .references(() => tasks.id, { onDelete: "cascade" })
      .notNull(),
    labelId: bigint("label_id", { mode: "number" })
      .references(() => labels.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.labelId] }),
  }),
)

// Comments/notes with polymorphic design
export const comments = pgTable("comments", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  userId: bigint("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  commentableType: varchar("commentable_type", { length: 50 }).notNull(),
  commentableId: bigint("commentable_id", { mode: "number" }).notNull(),
  parentCommentId: bigint("parent_comment_id", { mode: "number" }).references(
    (): AnyPgColumn => comments.id,
    { onDelete: "cascade" },
  ),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

export type Label = typeof labels.$inferSelect
export type NewLabel = typeof labels.$inferInsert

export type TaskLabel = typeof taskLabels.$inferSelect
export type NewTaskLabel = typeof taskLabels.$inferInsert

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
