import { describe, expect } from "vitest"
import type { CreateTaskData, TaskId } from "@/domain/entities/task"
import { createProjectRepository } from "@/infrastructure/repositories/project"
import { createTaskRepository } from "@/infrastructure/repositories/task"
import { createUserRepository } from "@/infrastructure/repositories/user"
import { it } from "@/test-helpers/db"

describe("Task Repository Integration Tests", () => {
  it("should create and find a task", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    // Create test user and project
    const user = await userRepository.create({
      email: "test@example.com",
      displayName: "Test User",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project",
      description: "A test project",
    })

    const taskData: CreateTaskData = {
      userId: user.id,
      projectId: project.id,
      title: "Test Task",
      description: "A test task",
      priority: 1,
      dueDate: new Date("2025-12-31"),
    }

    const createdTask = await taskRepository.create(taskData)

    expect(createdTask).toMatchObject({
      userId: user.id,
      projectId: project.id,
      title: "Test Task",
      description: "A test task",
      status: "pending",
      priority: 1,
      depth: 0,
    })
    expect(createdTask.id).toBeDefined()
    expect(createdTask.dueDate).toBeInstanceOf(Date)
    expect(createdTask.createdAt).toBeInstanceOf(Date)
    expect(createdTask.updatedAt).toBeInstanceOf(Date)
    expect(createdTask.deletedAt).toBeNull()
    expect(createdTask.completedAt).toBeNull()

    // Find task by ID
    const foundTasks = await taskRepository.find({ id: createdTask.id })
    expect(foundTasks).toHaveLength(1)
    expect(foundTasks[0]).toEqual(createdTask)
  })

  it("should create task with default priority when not provided", async ({
    env,
  }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test2@example.com",
      displayName: "Test User 2",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project 2",
      description: "A test project",
    })

    const taskData: CreateTaskData = {
      userId: user.id,
      projectId: project.id,
      title: "Task Without Priority",
      description: "Test default priority",
    }

    const createdTask = await taskRepository.create(taskData)
    expect(createdTask.priority).toBe(0)
  })

  it("should find tasks by userId", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test3@example.com",
      displayName: "Test User 3",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project 3",
      description: "A test project",
    })

    // Create multiple tasks for the user
    await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Task 1",
      description: "First task",
    })
    await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Task 2",
      description: "Second task",
    })

    const userTasks = await taskRepository.find({ userId: user.id })
    expect(userTasks).toHaveLength(2)
    expect(userTasks.every((t) => t.userId === user.id)).toBe(true)
  })

  it("should find tasks by projectId", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test4@example.com",
      displayName: "Test User 4",
    })

    const project1 = await projectRepository.create({
      userId: user.id,
      name: "Project 1",
      description: "First project",
    })

    const project2 = await projectRepository.create({
      userId: user.id,
      name: "Project 2",
      description: "Second project",
    })

    // Create tasks in different projects
    await taskRepository.create({
      userId: user.id,
      projectId: project1.id,
      title: "Task in Project 1",
      description: "Task description",
    })
    await taskRepository.create({
      userId: user.id,
      projectId: project2.id,
      title: "Task in Project 2",
      description: "Task description",
    })

    const project1Tasks = await taskRepository.find({ projectId: project1.id })
    expect(project1Tasks).toHaveLength(1)
    expect(project1Tasks[0].projectId).toBe(project1.id)
  })

  it("should create and find child tasks", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test5@example.com",
      displayName: "Test User 5",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project 5",
      description: "A test project",
    })

    // Create parent task
    const parentTask = await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Parent Task",
      description: "Parent task",
    })

    // Create child task
    const childTask = await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      parentTaskId: parentTask.id,
      title: "Child Task",
      description: "Child task",
    })

    expect(childTask.parentTaskId).toBe(parentTask.id)

    // Find child tasks
    const children = await taskRepository.findChildren(parentTask.id)
    expect(children).toHaveLength(1)
    expect(children[0]).toEqual(childTask)
  })

  it("should update a task", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test6@example.com",
      displayName: "Test User 6",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project 6",
      description: "A test project",
    })

    const task = await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Original Title",
      description: "Original description",
      priority: 1,
    })

    const updateData = {
      title: "Updated Title",
      description: "Updated description",
      priority: 2,
      dueDate: new Date("2025-12-25"),
    }

    const updatedTask = await taskRepository.update(task.id, updateData)

    expect(updatedTask).not.toBeNull()
    expect(updatedTask?.title).toBe("Updated Title")
    expect(updatedTask?.description).toBe("Updated description")
    expect(updatedTask?.priority).toBe(2)
    expect(updatedTask?.dueDate).toEqual(updateData.dueDate)
    expect(updatedTask?.updatedAt.getTime()).toBeGreaterThan(
      task.updatedAt.getTime(),
    )
  })

  it("should return null when updating non-existent task", async ({ env }) => {
    const taskRepository = createTaskRepository({ db: env.db })

    const nonExistentId = 99999 as TaskId
    const result = await taskRepository.update(nonExistentId, {
      title: "New Title",
    })

    expect(result).toBeNull()
  })

  it("should mark task as completed", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test7@example.com",
      displayName: "Test User 7",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project 7",
      description: "A test project",
    })

    const task = await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Task to Complete",
      description: "Will be completed",
    })

    const completedTask = await taskRepository.markCompleted(task.id)

    expect(completedTask).not.toBeNull()
    expect(completedTask?.status).toBe("completed")
    expect(completedTask?.completedAt).toBeInstanceOf(Date)
    expect(completedTask?.updatedAt.getTime()).toBeGreaterThan(
      task.updatedAt.getTime(),
    )
  })

  it("should return null when marking non-existent task as completed", async ({
    env,
  }) => {
    const taskRepository = createTaskRepository({ db: env.db })

    const nonExistentId = 99999 as TaskId
    const result = await taskRepository.markCompleted(nonExistentId)

    expect(result).toBeNull()
  })

  it("should soft delete a task", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test8@example.com",
      displayName: "Test User 8",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project 8",
      description: "A test project",
    })

    const task = await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Task to Delete",
      description: "Will be deleted",
    })

    const deleteResult = await taskRepository.delete(task.id)
    expect(deleteResult).toBe(true)

    // Task should not be found in normal queries (includeDeleted defaults to false)
    const foundTasks = await taskRepository.find({ id: task.id })
    expect(foundTasks).toHaveLength(0)
  })

  it("should return false when deleting non-existent task", async ({ env }) => {
    const taskRepository = createTaskRepository({ db: env.db })

    const nonExistentId = 99999 as TaskId
    const result = await taskRepository.delete(nonExistentId)

    expect(result).toBe(false)
  })

  it("should count tasks for a user", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test9@example.com",
      displayName: "Test User 9",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project 9",
      description: "A test project",
    })

    // Create multiple tasks
    await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Task 1",
      description: "First task",
    })
    await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Task 2",
      description: "Second task",
    })

    const count = await taskRepository.count(user.id)
    expect(count).toBe(2)
  })

  it("should find tasks with filters", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test10@example.com",
      displayName: "Test User 10",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project 10",
      description: "A test project",
    })

    // Create tasks with different statuses
    const task1 = await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Important Task",
      description: "High priority task",
      priority: 3,
    })

    await taskRepository.create({
      userId: user.id,
      projectId: project.id,
      title: "Normal Task",
      description: "Normal task",
      priority: 1,
    })

    // Mark one task as completed
    await taskRepository.markCompleted(task1.id)

    // Find tasks with search filter
    const searchResults = await taskRepository.find({
      userId: user.id,
      filters: { search: "Important" },
    })
    expect(searchResults).toHaveLength(1)
    expect(searchResults[0].title).toBe("Important Task")

    // Find tasks with status filter
    const completedTasks = await taskRepository.find({
      userId: user.id,
      filters: { status: "completed" },
    })
    expect(completedTasks).toHaveLength(1)
    expect(completedTasks[0].status).toBe("completed")

    // Find tasks with project filter
    const projectTasks = await taskRepository.find({
      userId: user.id,
      filters: { projectId: project.id },
    })
    expect(projectTasks).toHaveLength(2)
  })

  it("should handle pagination", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })
    const taskRepository = createTaskRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test11@example.com",
      displayName: "Test User 11",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Test Project 11",
      description: "A test project",
    })

    // Create 5 tasks
    for (let i = 1; i <= 5; i++) {
      await taskRepository.create({
        userId: user.id,
        projectId: project.id,
        title: `Task ${i}`,
        description: `Task ${i} description`,
      })
    }

    // Get first page (limit 2)
    const firstPage = await taskRepository.find({
      userId: user.id,
      filters: { limit: 2, page: 1 },
    })
    expect(firstPage).toHaveLength(2)

    // Get second page (limit 2)
    const secondPage = await taskRepository.find({
      userId: user.id,
      filters: { limit: 2, page: 2 },
    })
    expect(secondPage).toHaveLength(2)

    // Ensure different tasks
    expect(firstPage[0].id).not.toBe(secondPage[0].id)
  })
})
