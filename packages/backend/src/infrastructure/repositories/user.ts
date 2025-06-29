import { eq } from "drizzle-orm"
import type { CreateUserData, User, UserId } from "@/domain/entities/user"
import type { UserRepository } from "@/domain/repositories/user"
import type { DB } from "@/infrastructure/database/connection"
import type { User as DbUser } from "@/infrastructure/database/schema"
import { users } from "@/infrastructure/database/schema"

// Helper function to convert DB user to domain user
const toDomainUser = (dbUser: DbUser): User => ({
  id: dbUser.id,
  email: dbUser.email,
  displayName: dbUser.displayName,
  createdAt: dbUser.createdAt,
  updatedAt: dbUser.updatedAt,
  deletedAt: dbUser.deletedAt,
})

type Dependencies = {
  db: DB
}

const findUsers =
  ({ db }: Dependencies) =>
  async (options: { id: UserId } | { email: string }): Promise<User[]> => {
    if ("id" in options) {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, options.id))
      return result.map(toDomainUser)
    } else {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, options.email))
      return result.map(toDomainUser)
    }
  }

const createUser =
  ({ db }: Dependencies) =>
  async (data: CreateUserData): Promise<User> => {
    const existingUsers = await findUsers({ db })({ email: data.email })
    const existingUser = existingUsers[0] ?? null

    // If user exists but is deleted, we can restore them
    if (existingUser?.deletedAt) {
      const updatedUser = await db
        .update(users)
        .set({
          ...data,
          deletedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning()
      return toDomainUser(updatedUser[0])
    }

    // If user exists and is active, throw an error
    if (existingUser) {
      throw new Error(`User with email ${data.email} already exists`)
    }

    // If user does not exist, create a new one
    const createdUser = await db
      .insert(users)
      .values({
        email: data.email,
        displayName: data.displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
    return toDomainUser(createdUser[0])
  }

const updateUser =
  ({ db }: Dependencies) =>
  async (id: UserId, data: Partial<CreateUserData>): Promise<User | null> => {
    const result = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()
    return result[0] ? toDomainUser(result[0]) : null
  }

const deleteUser =
  ({ db }: Dependencies) =>
  async (id: UserId): Promise<boolean> => {
    const result = await db
      .update(users)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()
    return result.length > 0
  }

// Create a repository object that implements UserRepository interface
export const createUserRepository = (deps: Dependencies): UserRepository => ({
  find: findUsers(deps),
  create: createUser(deps),
  update: updateUser(deps),
  delete: deleteUser(deps),
})
