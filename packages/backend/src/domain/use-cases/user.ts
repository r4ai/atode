import type { CreateUserData, User, UserId } from "@/domain/entities/user"
import type { UserRepository } from "@/domain/repositories/user"

type UserDependencies = {
  repository: {
    user: UserRepository
  }
}

export const getUser = async (
  deps: UserDependencies,
  options: { id: UserId } | { email: string },
): Promise<User | null> => {
  const users = await deps.repository.user.find(options)
  return users[0] ?? null
}

export const createUser = async (
  deps: UserDependencies,
  data: CreateUserData,
): Promise<User> => {
  // Business logic: Check if user already exists
  const existingUser = await getUser(deps, { email: data.email })
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
  const user = await getUser(deps, { id })
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
  const user = await getUser(deps, { id })
  if (!user) {
    throw new Error("User not found")
  }

  const deleted = await deps.repository.user.delete(id)
  if (!deleted) {
    throw new Error("Failed to delete user")
  }
}
