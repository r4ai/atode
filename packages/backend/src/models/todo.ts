import { eq } from "drizzle-orm"
import { db } from "../db/connection"
import { type NewTodo, type Todo, todos } from "../db/schema"

export class TodoModel {
  static async getAll(): Promise<Todo[]> {
    return await db.select().from(todos).orderBy(todos.createdAt)
  }

  static async getById(id: string): Promise<Todo | undefined> {
    const result = await db.select().from(todos).where(eq(todos.id, id))
    return result[0]
  }

  static async create(
    newTodo: Omit<NewTodo, "id" | "createdAt" | "updatedAt">,
  ): Promise<Todo> {
    const result = await db
      .insert(todos)
      .values({
        ...newTodo,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
    return result[0]
  }

  static async update(
    id: string,
    updates: Partial<Omit<Todo, "id" | "createdAt">>,
  ): Promise<Todo | null> {
    const result = await db
      .update(todos)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning()
    return result[0] || null
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(todos).where(eq(todos.id, id)).returning()
    return result.length > 0
  }
}
