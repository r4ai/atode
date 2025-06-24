import { faker } from "@faker-js/faker"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createRandomProject } from "@/domain/entities/project.mock"
import {
  createRandomTask,
  createRandomTaskData,
} from "@/domain/entities/task.mock"
import { createMockProjectRepository } from "@/domain/repositories/project.mock"
import type { TaskFilters } from "@/domain/repositories/task"
import { createMockTaskRepository } from "@/domain/repositories/task.mock"
import {
  completeTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasksByProject,
  getTasksByUser,
  updateTask,
} from "./task"

describe("Task Use Cases", () => {
  let mockTaskRepository = createMockTaskRepository()
  let mockProjectRepository = createMockProjectRepository()
  const deps = {
    repository: {
      task: mockTaskRepository,
      project: mockProjectRepository,
    },
  }

  beforeEach(() => {
    mockTaskRepository = createMockTaskRepository()
    mockProjectRepository = createMockProjectRepository()
    deps.repository.task = mockTaskRepository
    deps.repository.project = mockProjectRepository
    vi.clearAllMocks()
    faker.seed(123) // Ensure consistent test data
  })

  describe("getTaskById", () => {
    it("should return task when found", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const mockTask = createRandomTask({ id: taskId })
      vi.mocked(mockTaskRepository.findById).mockResolvedValue(mockTask)

      const result = await getTaskById(deps, taskId)

      expect(result).toEqual(mockTask)
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
    })

    it("should return null when task not found", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      vi.mocked(mockTaskRepository.findById).mockResolvedValue(null)

      const result = await getTaskById(deps, taskId)

      expect(result).toBeNull()
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
    })
  })

  describe("getTasksByProject", () => {
    it("should return tasks for project", async () => {
      const projectId = faker.number.int({ min: 1, max: 100 })
      const mockTasks = [
        createRandomTask({ projectId }),
        createRandomTask({
          projectId,
          id: faker.number.int({ min: 101, max: 200 }),
        }),
      ]
      vi.mocked(mockTaskRepository.findByProjectId).mockResolvedValue(mockTasks)

      const result = await getTasksByProject(deps, projectId)

      expect(result).toEqual(mockTasks)
      expect(mockTaskRepository.findByProjectId).toHaveBeenCalledWith(projectId)
    })

    it("should return empty array when no tasks found", async () => {
      const projectId = faker.number.int({ min: 1, max: 100 })
      vi.mocked(mockTaskRepository.findByProjectId).mockResolvedValue([])

      const result = await getTasksByProject(deps, projectId)

      expect(result).toEqual([])
      expect(mockTaskRepository.findByProjectId).toHaveBeenCalledWith(projectId)
    })
  })

  describe("getTasksByUser", () => {
    it("should return tasks for user without filters", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const mockTasks = [
        createRandomTask({ userId }),
        createRandomTask({
          userId,
          id: faker.number.int({ min: 101, max: 200 }),
        }),
      ]
      vi.mocked(mockTaskRepository.findByUserId).mockResolvedValue(mockTasks)

      const result = await getTasksByUser(deps, userId)

      expect(result).toEqual(mockTasks)
      expect(mockTaskRepository.findByUserId).toHaveBeenCalledWith(
        userId,
        undefined,
      )
    })

    it("should return tasks for user with filters", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const filters: TaskFilters = { status: "completed", limit: 10 }
      const mockTasks = [createRandomTask({ userId, status: "completed" })]
      vi.mocked(mockTaskRepository.findByUserId).mockResolvedValue(mockTasks)

      const result = await getTasksByUser(deps, userId, filters)

      expect(result).toEqual(mockTasks)
      expect(mockTaskRepository.findByUserId).toHaveBeenCalledWith(
        userId,
        filters,
      )
    })
  })

  describe("createTask", () => {
    it("should create task when project exists and user has access", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const projectId = faker.number.int({ min: 1, max: 100 })
      const taskData = createRandomTaskData({ userId, projectId })
      const mockProject = createRandomProject({ id: projectId, userId })
      const mockTask = createRandomTask(taskData)

      vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject)
      vi.mocked(mockTaskRepository.create).mockResolvedValue(mockTask)

      const result = await createTask(deps, taskData)

      expect(result).toEqual(mockTask)
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId)
      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData)
    })

    it("should throw error when project not found", async () => {
      const taskData = createRandomTaskData()
      vi.mocked(mockProjectRepository.findById).mockResolvedValue(null)

      await expect(createTask(deps, taskData)).rejects.toThrow(
        "Project not found",
      )
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(
        taskData.projectId,
      )
      expect(mockTaskRepository.create).not.toHaveBeenCalled()
    })

    it("should throw error when user does not have access to project", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const projectOwnerId = faker.number.int({ min: 101, max: 200 })
      const taskData = createRandomTaskData({ userId })
      const mockProject = createRandomProject({
        id: taskData.projectId,
        userId: projectOwnerId,
      })

      vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject)

      await expect(createTask(deps, taskData)).rejects.toThrow(
        "User does not have access to this project",
      )
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(
        taskData.projectId,
      )
      expect(mockTaskRepository.create).not.toHaveBeenCalled()
    })

    it("should create task with parent when parent exists and belongs to same project", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const projectId = faker.number.int({ min: 1, max: 100 })
      const parentTaskId = faker.number.int({ min: 1, max: 100 })
      const taskData = createRandomTaskData({
        userId,
        projectId,
        parentTaskId,
      })
      const mockProject = createRandomProject({ id: projectId, userId })
      const mockParentTask = createRandomTask({ id: parentTaskId, projectId })
      const mockTask = createRandomTask(taskData)

      vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject)
      vi.mocked(mockTaskRepository.findById).mockResolvedValue(mockParentTask)
      vi.mocked(mockTaskRepository.create).mockResolvedValue(mockTask)

      const result = await createTask(deps, taskData)

      expect(result).toEqual(mockTask)
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId)
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(parentTaskId)
      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData)
    })

    it("should throw error when parent task not found", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const projectId = faker.number.int({ min: 1, max: 100 })
      const parentTaskId = faker.number.int({ min: 1, max: 100 })
      const taskData = createRandomTaskData({
        userId,
        projectId,
        parentTaskId,
      })
      const mockProject = createRandomProject({ id: projectId, userId })

      vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject)
      vi.mocked(mockTaskRepository.findById).mockResolvedValue(null)

      await expect(createTask(deps, taskData)).rejects.toThrow(
        "Parent task not found",
      )
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId)
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(parentTaskId)
      expect(mockTaskRepository.create).not.toHaveBeenCalled()
    })

    it("should throw error when parent task belongs to different project", async () => {
      const userId = faker.number.int({ min: 1, max: 100 })
      const projectId = faker.number.int({ min: 1, max: 100 })
      const parentProjectId = faker.number.int({ min: 101, max: 200 })
      const parentTaskId = faker.number.int({ min: 1, max: 100 })
      const taskData = createRandomTaskData({
        userId,
        projectId,
        parentTaskId,
      })
      const mockProject = createRandomProject({ id: projectId, userId })
      const mockParentTask = createRandomTask({
        id: parentTaskId,
        projectId: parentProjectId,
      })

      vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject)
      vi.mocked(mockTaskRepository.findById).mockResolvedValue(mockParentTask)

      await expect(createTask(deps, taskData)).rejects.toThrow(
        "Parent task must belong to the same project",
      )
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId)
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(parentTaskId)
      expect(mockTaskRepository.create).not.toHaveBeenCalled()
    })
  })

  describe("updateTask", () => {
    it("should update task when user has access", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const updateData = { title: faker.lorem.sentence() }
      const existingTask = createRandomTask({ id: taskId, userId })
      const updatedTask = createRandomTask({ ...existingTask, ...updateData })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)
      vi.mocked(mockTaskRepository.update).mockResolvedValue(updatedTask)

      const result = await updateTask(deps, taskId, updateData, userId)

      expect(result).toEqual(updatedTask)
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, updateData)
    })

    it("should throw error when task not found", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const updateData = { title: faker.lorem.sentence() }

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(null)

      await expect(
        updateTask(deps, taskId, updateData, userId),
      ).rejects.toThrow("Task not found")
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.update).not.toHaveBeenCalled()
    })

    it("should throw error when user does not have access", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const taskOwnerId = faker.number.int({ min: 101, max: 200 })
      const updateData = { title: faker.lorem.sentence() }
      const existingTask = createRandomTask({
        id: taskId,
        userId: taskOwnerId,
      })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)

      await expect(
        updateTask(deps, taskId, updateData, userId),
      ).rejects.toThrow("Task not found")
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.update).not.toHaveBeenCalled()
    })

    it("should throw error when update fails", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const updateData = { title: faker.lorem.sentence() }
      const existingTask = createRandomTask({ id: taskId, userId })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)
      vi.mocked(mockTaskRepository.update).mockResolvedValue(null)

      await expect(
        updateTask(deps, taskId, updateData, userId),
      ).rejects.toThrow("Failed to update task")
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, updateData)
    })
  })

  describe("completeTask", () => {
    it("should complete task when user has access and task is not completed", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const existingTask = createRandomTask({
        id: taskId,
        userId,
        status: "in_progress",
      })
      const completedTask = createRandomTask({
        ...existingTask,
        status: "completed",
        completedAt: faker.date.recent(),
      })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)
      vi.mocked(mockTaskRepository.markCompleted).mockResolvedValue(
        completedTask,
      )

      const result = await completeTask(deps, taskId, userId)

      expect(result).toEqual(completedTask)
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.markCompleted).toHaveBeenCalledWith(taskId)
    })

    it("should throw error when task not found", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(null)

      await expect(completeTask(deps, taskId, userId)).rejects.toThrow(
        "Task not found",
      )
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.markCompleted).not.toHaveBeenCalled()
    })

    it("should throw error when user does not have access", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const taskOwnerId = faker.number.int({ min: 101, max: 200 })
      const existingTask = createRandomTask({
        id: taskId,
        userId: taskOwnerId,
      })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)

      await expect(completeTask(deps, taskId, userId)).rejects.toThrow(
        "Task not found",
      )
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.markCompleted).not.toHaveBeenCalled()
    })

    it("should throw error when task is already completed", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const existingTask = createRandomTask({
        id: taskId,
        userId,
        status: "completed",
      })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)

      await expect(completeTask(deps, taskId, userId)).rejects.toThrow(
        "Task is already completed",
      )
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.markCompleted).not.toHaveBeenCalled()
    })

    it("should throw error when completion fails", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const existingTask = createRandomTask({
        id: taskId,
        userId,
        status: "in_progress",
      })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)
      vi.mocked(mockTaskRepository.markCompleted).mockResolvedValue(null)

      await expect(completeTask(deps, taskId, userId)).rejects.toThrow(
        "Failed to complete task",
      )
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.markCompleted).toHaveBeenCalledWith(taskId)
    })
  })

  describe("deleteTask", () => {
    it("should delete task when user has access", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const existingTask = createRandomTask({ id: taskId, userId })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)
      vi.mocked(mockTaskRepository.delete).mockResolvedValue(true)

      await deleteTask(deps, taskId, userId)

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId)
    })

    it("should throw error when task not found", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(null)

      await expect(deleteTask(deps, taskId, userId)).rejects.toThrow(
        "Task not found",
      )
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.delete).not.toHaveBeenCalled()
    })

    it("should throw error when user does not have access", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const taskOwnerId = faker.number.int({ min: 101, max: 200 })
      const existingTask = createRandomTask({
        id: taskId,
        userId: taskOwnerId,
      })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)

      await expect(deleteTask(deps, taskId, userId)).rejects.toThrow(
        "Task not found",
      )
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.delete).not.toHaveBeenCalled()
    })

    it("should throw error when delete fails", async () => {
      const taskId = faker.number.int({ min: 1, max: 100 })
      const userId = faker.number.int({ min: 1, max: 100 })
      const existingTask = createRandomTask({ id: taskId, userId })

      vi.mocked(mockTaskRepository.findById).mockResolvedValue(existingTask)
      vi.mocked(mockTaskRepository.delete).mockResolvedValue(false)

      await expect(deleteTask(deps, taskId, userId)).rejects.toThrow(
        "Failed to delete task",
      )
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId)
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId)
    })
  })
})
