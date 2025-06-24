import { faker } from "@faker-js/faker"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  createRandomUser,
  createRandomUserData,
} from "@/domain/entities/user.mock"
import { createMockUserRepository } from "@/domain/repositories/user.mock"
import { createUser, deleteUser, getUser, updateUser } from "./user"

describe("User Use Cases", () => {
  let mockUserRepository = createMockUserRepository()
  const deps = { repository: { user: mockUserRepository } }

  beforeEach(() => {
    mockUserRepository = createMockUserRepository()
    deps.repository.user = mockUserRepository
    vi.clearAllMocks()
    faker.seed(123) // Ensure consistent test data
  })

  describe("getUser by id", () => {
    it("should return user when found", async () => {
      const mockUser = createRandomUser({ id: 1, email: "john@example.com" })
      vi.mocked(mockUserRepository.find).mockResolvedValue([mockUser])

      const result = await getUser(deps, { id: 1 })

      expect(result).toEqual(mockUser)
      expect(mockUserRepository.find).toHaveBeenCalledWith({ id: 1 })
    })

    it("should return null when user not found", async () => {
      vi.mocked(mockUserRepository.find).mockResolvedValue([])

      const result = await getUser(deps, { id: 999 })

      expect(result).toBeNull()
      expect(mockUserRepository.find).toHaveBeenCalledWith({ id: 999 })
    })
  })

  describe("getUser by email", () => {
    it("should return user when found", async () => {
      const email = faker.internet.email()
      const mockUser = createRandomUser({ email })
      vi.mocked(mockUserRepository.find).mockResolvedValue([mockUser])

      const result = await getUser(deps, { email })

      expect(result).toEqual(mockUser)
      expect(mockUserRepository.find).toHaveBeenCalledWith({ email })
    })

    it("should return null when user not found", async () => {
      const email = faker.internet.email()
      vi.mocked(mockUserRepository.find).mockResolvedValue([])

      const result = await getUser(deps, { email })

      expect(result).toBeNull()
      expect(mockUserRepository.find).toHaveBeenCalledWith({ email })
    })
  })

  describe("createUser", () => {
    it("should create user when email does not exist", async () => {
      const userData = createRandomUserData({
        email: "new@example.com",
        displayName: "New User",
      })
      const mockUser = createRandomUser(userData)

      vi.mocked(mockUserRepository.find).mockResolvedValue([])
      vi.mocked(mockUserRepository.create).mockResolvedValue(mockUser)

      const result = await createUser(deps, userData)

      expect(result).toEqual(mockUser)
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        email: userData.email,
      })
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData)
    })

    it("should throw error when user with email already exists", async () => {
      const userData = createRandomUserData()
      const existingUser = createRandomUser({ email: userData.email })

      vi.mocked(mockUserRepository.find).mockResolvedValue([existingUser])

      await expect(createUser(deps, userData)).rejects.toThrow(
        "User with this email already exists",
      )
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        email: userData.email,
      })
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })
  })

  describe("updateUser", () => {
    it("should update user when user exists", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const updateData = { displayName: faker.person.fullName() }
      const existingUser = createRandomUser({ id: userId })
      const updatedUser = createRandomUser({ ...existingUser, ...updateData })

      vi.mocked(mockUserRepository.find).mockResolvedValue([existingUser])
      vi.mocked(mockUserRepository.update).mockResolvedValue(updatedUser)

      const result = await updateUser(deps, userId, updateData)

      expect(result).toEqual(updatedUser)
      expect(mockUserRepository.find).toHaveBeenCalledWith({ id: userId })
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData)
    })

    it("should throw error when user not found", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const updateData = { displayName: faker.person.fullName() }

      vi.mocked(mockUserRepository.find).mockResolvedValue([])

      await expect(updateUser(deps, userId, updateData)).rejects.toThrow(
        "User not found",
      )
      expect(mockUserRepository.find).toHaveBeenCalledWith({ id: userId })
      expect(mockUserRepository.update).not.toHaveBeenCalled()
    })

    it("should throw error when update fails", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const updateData = { displayName: faker.person.fullName() }
      const existingUser = createRandomUser({ id: userId })

      vi.mocked(mockUserRepository.find).mockResolvedValue([existingUser])
      vi.mocked(mockUserRepository.update).mockResolvedValue(null)

      await expect(updateUser(deps, userId, updateData)).rejects.toThrow(
        "Failed to update user",
      )
      expect(mockUserRepository.find).toHaveBeenCalledWith({ id: userId })
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData)
    })
  })

  describe("deleteUser", () => {
    it("should delete user when user exists", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const existingUser = createRandomUser({ id: userId })

      vi.mocked(mockUserRepository.find).mockResolvedValue([existingUser])
      vi.mocked(mockUserRepository.delete).mockResolvedValue(true)

      await deleteUser(deps, userId)

      expect(mockUserRepository.find).toHaveBeenCalledWith({ id: userId })
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId)
    })

    it("should throw error when user not found", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })

      vi.mocked(mockUserRepository.find).mockResolvedValue([])

      await expect(deleteUser(deps, userId)).rejects.toThrow("User not found")
      expect(mockUserRepository.find).toHaveBeenCalledWith({ id: userId })
      expect(mockUserRepository.delete).not.toHaveBeenCalled()
    })

    it("should throw error when delete fails", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const existingUser = createRandomUser({ id: userId })

      vi.mocked(mockUserRepository.find).mockResolvedValue([existingUser])
      vi.mocked(mockUserRepository.delete).mockResolvedValue(false)

      await expect(deleteUser(deps, userId)).rejects.toThrow(
        "Failed to delete user",
      )
      expect(mockUserRepository.find).toHaveBeenCalledWith({ id: userId })
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId)
    })
  })
})
