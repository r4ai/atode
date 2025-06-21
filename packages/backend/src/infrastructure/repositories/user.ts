import { eq } from "drizzle-orm"
import type { CreateUserData, User, UserId } from "@/domain/entities/user"
import type { UserRepository } from "@/domain/repositories/user"
import { db } from "@/infrastructure/database/connection"
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

export const findUserById = async (id: UserId): Promise<User | null> => {
  const result = await db.select().from(users).where(eq(users.id, id))
  return result[0] ? toDomainUser(result[0]) : null
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await db.select().from(users).where(eq(users.email, email))
  return result[0] ? toDomainUser(result[0]) : null
}

export const createUser = async (data: CreateUserData): Promise<User> => {
  const result = await db
    .insert(users)
    .values({
      email: data.email,
      displayName: data.displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()
  return toDomainUser(result[0])
}

export const updateUser = async (
  id: UserId,
  data: Partial<CreateUserData>,
): Promise<User | null> => {
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

export const deleteUser = async (id: UserId): Promise<boolean> => {
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
export const userRepository: UserRepository = {
  findById: findUserById,
  findByEmail: findUserByEmail,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
}
