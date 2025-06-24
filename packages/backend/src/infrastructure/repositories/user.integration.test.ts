import { describe, expect } from "vitest"
import type { CreateUserData, UserId } from "@/domain/entities/user"
import { createUserRepository } from "@/infrastructure/repositories/user"
import { it } from "@/test-helpers/db"

describe("User Repository Integration Tests", () => {
  it("should create and find a user", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })

    const userData: CreateUserData = {
      email: "test@example.com",
      displayName: "Test User",
    }

    const createdUser = await userRepository.create(userData)

    expect(createdUser).toMatchObject({
      email: "test@example.com",
      displayName: "Test User",
    })
    expect(createdUser.id).toBeDefined()
    expect(createdUser.createdAt).toBeInstanceOf(Date)
    expect(createdUser.updatedAt).toBeInstanceOf(Date)
    expect(createdUser.deletedAt).toBeNull()

    // Find user by ID
    const foundUsersById = await userRepository.find({ id: createdUser.id })
    expect(foundUsersById).toHaveLength(1)
    expect(foundUsersById[0]).toEqual(createdUser)

    // Find user by email
    const foundUsersByEmail = await userRepository.find({
      email: createdUser.email,
    })
    expect(foundUsersByEmail).toHaveLength(1)
    expect(foundUsersByEmail[0]).toEqual(createdUser)
  })

  it("should throw error when creating user with existing email", async ({
    env,
  }) => {
    const userRepository = createUserRepository({ db: env.db })

    const userData: CreateUserData = {
      email: "duplicate@example.com",
      displayName: "First User",
    }

    // Create first user
    await userRepository.create(userData)

    // Try to create second user with same email
    const duplicateUserData: CreateUserData = {
      email: "duplicate@example.com",
      displayName: "Second User",
    }

    await expect(userRepository.create(duplicateUserData)).rejects.toThrow(
      "User with email duplicate@example.com already exists",
    )
  })

  it("should restore deleted user when creating with same email", async ({
    env,
  }) => {
    const userRepository = createUserRepository({ db: env.db })

    const userData: CreateUserData = {
      email: "restore@example.com",
      displayName: "Original User",
    }

    // Create user
    const originalUser = await userRepository.create(userData)

    // Delete user
    const deleteResult = await userRepository.delete(originalUser.id)
    expect(deleteResult).toBe(true)

    // Try to create user with same email but different display name
    const newUserData: CreateUserData = {
      email: "restore@example.com",
      displayName: "Restored User",
    }

    const restoredUser = await userRepository.create(newUserData)

    expect(restoredUser.id).toBe(originalUser.id) // Same ID (restored)
    expect(restoredUser.email).toBe("restore@example.com")
    expect(restoredUser.displayName).toBe("Restored User") // Updated display name
    expect(restoredUser.deletedAt).toBeNull() // No longer deleted
  })

  it("should update a user", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })

    const user = await userRepository.create({
      email: "update@example.com",
      displayName: "Original Name",
    })

    const updateData = {
      displayName: "Updated Name",
    }

    const updatedUser = await userRepository.update(user.id, updateData)

    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.displayName).toBe("Updated Name")
    expect(updatedUser?.email).toBe("update@example.com") // Should remain unchanged
    expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(
      user.updatedAt.getTime(),
    )
  })

  it("should update user email", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })

    const user = await userRepository.create({
      email: "old@example.com",
      displayName: "Test User",
    })

    const updateData = {
      email: "new@example.com",
      displayName: "Updated User",
    }

    const updatedUser = await userRepository.update(user.id, updateData)

    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.email).toBe("new@example.com")
    expect(updatedUser?.displayName).toBe("Updated User")
    expect(updatedUser?.id).toBe(user.id) // ID should remain the same
  })

  it("should return null when updating non-existent user", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })

    const nonExistentId = 99999 as UserId
    const result = await userRepository.update(nonExistentId, {
      displayName: "New Name",
    })

    expect(result).toBeNull()
  })

  it("should soft delete a user", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })

    const user = await userRepository.create({
      email: "delete@example.com",
      displayName: "User to Delete",
    })

    const deleteResult = await userRepository.delete(user.id)
    expect(deleteResult).toBe(true)

    // User should still be found by ID (soft delete)
    const foundUsersById = await userRepository.find({ id: user.id })
    expect(foundUsersById).toHaveLength(1)
    expect(foundUsersById[0].deletedAt).toBeInstanceOf(Date)

    // User should still be found by email (soft delete)
    const foundUsersByEmail = await userRepository.find({ email: user.email })
    expect(foundUsersByEmail).toHaveLength(1)
    expect(foundUsersByEmail[0].deletedAt).toBeInstanceOf(Date)
  })

  it("should return false when deleting non-existent user", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })

    const nonExistentId = 99999 as UserId
    const result = await userRepository.delete(nonExistentId)

    expect(result).toBe(false)
  })

  it("should return empty array when user not found by ID", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })

    const nonExistentId = 99999 as UserId
    const foundUsers = await userRepository.find({ id: nonExistentId })

    expect(foundUsers).toHaveLength(0)
  })

  it("should return empty array when user not found by email", async ({
    env,
  }) => {
    const userRepository = createUserRepository({ db: env.db })

    const foundUsers = await userRepository.find({
      email: "nonexistent@example.com",
    })

    expect(foundUsers).toHaveLength(0)
  })

  it("should handle partial updates", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })

    const user = await userRepository.create({
      email: "partial@example.com",
      displayName: "Original Name",
    })

    // Update only display name
    const updatedUser1 = await userRepository.update(user.id, {
      displayName: "New Name",
    })

    expect(updatedUser1).not.toBeNull()
    expect(updatedUser1?.displayName).toBe("New Name")
    expect(updatedUser1?.email).toBe("partial@example.com") // Should remain unchanged

    // Update only email
    const updatedUser2 = await userRepository.update(user.id, {
      email: "newpartial@example.com",
    })

    expect(updatedUser2).not.toBeNull()
    expect(updatedUser2?.email).toBe("newpartial@example.com")
    expect(updatedUser2?.displayName).toBe("New Name") // Should remain from previous update
  })

  it("should handle empty partial update", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })

    const user = await userRepository.create({
      email: "empty@example.com",
      displayName: "Test User",
    })

    // Update with empty object
    const updatedUser = await userRepository.update(user.id, {})

    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.email).toBe("empty@example.com")
    expect(updatedUser?.displayName).toBe("Test User")
    expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(
      user.updatedAt.getTime(),
    )
  })
})
