import { eq } from "drizzle-orm"
import { describe, expect } from "vitest"
import type { CreateProjectData, ProjectId } from "@/domain/entities/project"
import { projects } from "@/infrastructure/database/schema"
import { createProjectRepository } from "@/infrastructure/repositories/project"
import { createUserRepository } from "@/infrastructure/repositories/user"
import { it } from "@/test-helpers/db"

describe("Project Repository Integration Tests", () => {
  it("should create and find a project", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })

    // Create a test user first
    const user = await userRepository.create({
      email: "test@example.com",
      displayName: "Test User",
    })

    const projectData: CreateProjectData = {
      userId: user.id,
      name: "Test Project",
      description: "A test project",
      color: "#FF0000",
    }

    const createdProject = await projectRepository.create(projectData)

    expect(createdProject).toMatchObject({
      userId: user.id,
      name: "Test Project",
      description: "A test project",
      color: "#FF0000",
      depth: 0,
    })
    expect(createdProject.id).toBeDefined()
    expect(createdProject.createdAt).toBeInstanceOf(Date)
    expect(createdProject.updatedAt).toBeInstanceOf(Date)
    expect(createdProject.deletedAt).toBeNull()

    // Find project by ID
    const foundProjects = await projectRepository.find({
      id: createdProject.id,
    })
    expect(foundProjects).toHaveLength(1)
    expect(foundProjects[0]).toEqual(createdProject)
  })

  it("should create project with default color when not provided", async ({
    env,
  }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test2@example.com",
      displayName: "Test User 2",
    })

    const projectData: CreateProjectData = {
      userId: user.id,
      name: "Project Without Color",
      description: "Test default color",
    }

    const createdProject = await projectRepository.create(projectData)
    expect(createdProject.color).toBe("#808080")
  })

  it("should find projects by userId", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test3@example.com",
      displayName: "Test User 3",
    })

    // Create multiple projects for the user
    await projectRepository.create({
      userId: user.id,
      name: "Project 1",
      description: "First project",
    })
    await projectRepository.create({
      userId: user.id,
      name: "Project 2",
      description: "Second project",
    })

    const userProjects = await projectRepository.find({ userId: user.id })
    expect(userProjects).toHaveLength(2)
    expect(userProjects.every((p) => p.userId === user.id)).toBe(true)
  })

  it("should create and find child projects", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test4@example.com",
      displayName: "Test User 4",
    })

    // Create parent project
    const parentProject = await projectRepository.create({
      userId: user.id,
      name: "Parent Project",
      description: "Parent project",
    })

    // Create child project
    const childProject = await projectRepository.create({
      userId: user.id,
      parentProjectId: parentProject.id,
      name: "Child Project",
      description: "Child project",
      depth: 1,
    })

    expect(childProject.parentProjectId).toBe(parentProject.id)
    expect(childProject.depth).toBe(1)

    // Find child projects
    const children = await projectRepository.findChildren(parentProject.id)
    expect(children).toHaveLength(1)
    expect(children[0]).toEqual(childProject)

    // Find projects by parent ID
    const foundByParent = await projectRepository.find({
      parentProjectId: parentProject.id,
    })
    expect(foundByParent).toHaveLength(1)
    expect(foundByParent[0]).toEqual(childProject)
  })

  it("should update a project", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test5@example.com",
      displayName: "Test User 5",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Original Name",
      description: "Original description",
    })

    const updateData = {
      name: "Updated Name",
      description: "Updated description",
      color: "#00FF00",
    }

    const updatedProject = await projectRepository.update(
      project.id,
      updateData,
    )

    expect(updatedProject).not.toBeNull()
    expect(updatedProject?.name).toBe("Updated Name")
    expect(updatedProject?.description).toBe("Updated description")
    expect(updatedProject?.color).toBe("#00FF00")
    expect(updatedProject?.updatedAt.getTime()).toBeGreaterThan(
      project.updatedAt.getTime(),
    )
  })

  it("should return null when updating non-existent project", async ({
    env,
  }) => {
    const projectRepository = createProjectRepository({ db: env.db })

    const nonExistentId = 99999 as ProjectId
    const result = await projectRepository.update(nonExistentId, {
      name: "New Name",
    })

    expect(result).toBeNull()
  })

  it("should soft delete a project", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })

    const user = await userRepository.create({
      email: "test6@example.com",
      displayName: "Test User 6",
    })

    const project = await projectRepository.create({
      userId: user.id,
      name: "Project to Delete",
      description: "Will be deleted",
    })

    const deleteResult = await projectRepository.delete(project.id)
    expect(deleteResult).toBe(true)

    // Project should not be found after soft delete (excluded by default)
    const foundProjects = await projectRepository.find({ id: project.id })
    expect(foundProjects).toHaveLength(0)

    // Verify project is soft deleted by checking directly in database
    const deletedProject = await env.db
      .select()
      .from(projects)
      .where(eq(projects.id, project.id))
    expect(deletedProject).toHaveLength(1)
    expect(deletedProject[0].deletedAt).toBeInstanceOf(Date)
  })

  it("should return false when deleting non-existent project", async ({
    env,
  }) => {
    const projectRepository = createProjectRepository({ db: env.db })

    const nonExistentId = 99999 as ProjectId
    const result = await projectRepository.delete(nonExistentId)

    expect(result).toBe(false)
  })

  it("should find all projects when no options provided", async ({ env }) => {
    const userRepository = createUserRepository({ db: env.db })
    const projectRepository = createProjectRepository({ db: env.db })

    const user1 = await userRepository.create({
      email: "test7@example.com",
      displayName: "Test User 7",
    })
    const user2 = await userRepository.create({
      email: "test8@example.com",
      displayName: "Test User 8",
    })

    // Create projects for different users
    await projectRepository.create({
      userId: user1.id,
      name: "User 1 Project",
      description: "Project 1",
    })
    await projectRepository.create({
      userId: user2.id,
      name: "User 2 Project",
      description: "Project 2",
    })

    const allProjects = await projectRepository.find({})
    expect(allProjects.length).toBeGreaterThanOrEqual(2)
  })
})
