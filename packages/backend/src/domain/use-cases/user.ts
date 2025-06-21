import type { CreateUserData, User, UserId } from "@/domain/entities/user"
import type { UserRepository } from "@/domain/repositories/user"

type UserDependencies = {
  repository: {
    user: UserRepository
  }
}

export const getUserById = async (
  deps: UserDependencies,
  id: UserId,
): Promise<User | null> => {
  return await deps.repository.user.findById(id)
}

export const getUserByEmail = async (
  deps: UserDependencies,
  email: string,
): Promise<User | null> => {
  return await deps.repository.user.findByEmail(email)
}

export const createUser = async (
  deps: UserDependencies,
  data: CreateUserData,
): Promise<User> => {
  // Business logic: Check if user already exists
  const existingUser = await deps.repository.user.findByEmail(data.email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  return await deps.repository.user.create(data)
}

export const updateUser = async (
  deps: UserDependencies,
  id: UserId,
  data: Partial<CreateUserData>,
): Promise<User> => {
  const user = await deps.repository.user.findById(id)
  if (!user) {
    throw new Error("User not found")
  }

  const updatedUser = await deps.repository.user.update(id, data)
  if (!updatedUser) {
    throw new Error("Failed to update user")
  }

  return updatedUser
}

export const deleteUser = async (
  deps: UserDependencies,
  id: UserId,
): Promise<void> => {
  const user = await deps.repository.user.findById(id)
  if (!user) {
    throw new Error("User not found")
  }

  const deleted = await deps.repository.user.delete(id)
  if (!deleted) {
    throw new Error("Failed to delete user")
  }
}
