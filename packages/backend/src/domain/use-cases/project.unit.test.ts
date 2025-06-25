import { beforeEach, describe, expect, test } from "vitest"
import {
  createRandomProject,
  createRandomProjectData,
} from "@/domain/entities/project.mock"
import { createMockProjectRepository } from "@/domain/repositories/project.mock"
import {
  createProject,
  deleteProject,
  getChildProjects,
  getProject,
  getProjects,
  updateProject,
} from "./project"

describe("Project use cases", () => {
  const mockProjectRepository = createMockProjectRepository()

  const deps = {
    repository: {
      project: mockProjectRepository,
    },
  }

  beforeEach(() => {
    mockProjectRepository.find.mockClear()
    mockProjectRepository.findChildren.mockClear()
    mockProjectRepository.create.mockClear()
    mockProjectRepository.update.mockClear()
    mockProjectRepository.delete.mockClear()
  })

  describe("getProject", () => {
    test("should return project when found", async () => {
      const userId = 1
      const projectId = 1
      const project = createRandomProject({ id: projectId, userId })

      mockProjectRepository.find.mockResolvedValue([project])

      const result = await getProject(deps, projectId, userId)

      expect(result).toEqual(project)
      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: projectId,
        userId,
      })
    })

    test("should return null when project not found", async () => {
      const userId = 1
      const projectId = 999

      mockProjectRepository.find.mockResolvedValue([])

      const result = await getProject(deps, projectId, userId)

      expect(result).toBeNull()
      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: projectId,
        userId,
      })
    })
  })

  describe("getProjects", () => {
    test("should return all user projects", async () => {
      const userId = 1
      const projects = [
        createRandomProject({ id: 1, userId }),
        createRandomProject({ id: 2, userId }),
      ]

      mockProjectRepository.find.mockResolvedValue(projects)

      const result = await getProjects(deps, userId)

      expect(result).toEqual(projects)
      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        userId,
        parentProjectId: undefined,
      })
    })

    test("should return projects with specific parent", async () => {
      const userId = 1
      const parentProjectId = 1
      const childProjects = [
        createRandomProject({ id: 2, userId, parentProjectId }),
        createRandomProject({ id: 3, userId, parentProjectId }),
      ]

      mockProjectRepository.find.mockResolvedValue(childProjects)

      const result = await getProjects(deps, userId, parentProjectId)

      expect(result).toEqual(childProjects)
      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        userId,
        parentProjectId,
      })
    })
  })

  describe("getChildProjects", () => {
    test("should return child projects when parent exists", async () => {
      const userId = 1
      const parentProjectId = 1
      const parentProject = createRandomProject({ id: parentProjectId, userId })
      const childProjects = [
        createRandomProject({ id: 2, userId, parentProjectId }),
        createRandomProject({ id: 3, userId, parentProjectId }),
      ]

      mockProjectRepository.find.mockResolvedValue([parentProject])
      mockProjectRepository.findChildren.mockResolvedValue(childProjects)

      const result = await getChildProjects(deps, parentProjectId, userId)

      expect(result).toEqual(childProjects)
      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: parentProjectId,
        userId,
      })
      expect(mockProjectRepository.findChildren).toHaveBeenCalledWith(
        parentProjectId,
      )
    })

    test("should throw error when parent project not found", async () => {
      const userId = 1
      const parentProjectId = 999

      mockProjectRepository.find.mockResolvedValue([])

      await expect(
        getChildProjects(deps, parentProjectId, userId),
      ).rejects.toThrow("Parent project not found")

      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: parentProjectId,
        userId,
      })
      expect(mockProjectRepository.findChildren).not.toHaveBeenCalled()
    })
  })

  describe("createProject", () => {
    test("should create project successfully", async () => {
      const projectData = createRandomProjectData()
      const createdProject = createRandomProject(projectData)

      mockProjectRepository.create.mockResolvedValue(createdProject)

      const result = await createProject(deps, projectData)

      expect(result).toEqual(createdProject)
      expect(mockProjectRepository.create).toHaveBeenCalledWith(projectData)
    })

    test("should create project with parent when parent exists", async () => {
      const userId = 1
      const parentProjectId = 1
      const parentProject = createRandomProject({ id: parentProjectId, userId })
      const projectData = createRandomProjectData({ userId, parentProjectId })
      const createdProject = createRandomProject(projectData)

      mockProjectRepository.find.mockResolvedValue([parentProject])
      mockProjectRepository.create.mockResolvedValue(createdProject)

      const result = await createProject(deps, projectData)

      expect(result).toEqual(createdProject)
      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: parentProjectId,
        userId,
      })
      expect(mockProjectRepository.create).toHaveBeenCalledWith(projectData)
    })

    test("should throw error when parent project not found", async () => {
      const userId = 1
      const parentProjectId = 999
      const projectData = createRandomProjectData({ userId, parentProjectId })

      mockProjectRepository.find.mockResolvedValue([])

      await expect(createProject(deps, projectData)).rejects.toThrow(
        "Parent project not found",
      )

      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: parentProjectId,
        userId,
      })
      expect(mockProjectRepository.create).not.toHaveBeenCalled()
    })
  })

  describe("updateProject", () => {
    test("should update project successfully", async () => {
      const userId = 1
      const projectId = 1
      const project = createRandomProject({ id: projectId, userId })
      const updateData = { name: "Updated Project Name" }
      const updatedProject = { ...project, ...updateData }

      mockProjectRepository.find.mockResolvedValue([project])
      mockProjectRepository.update.mockResolvedValue(updatedProject)

      const result = await updateProject(deps, projectId, updateData, userId)

      expect(result).toEqual(updatedProject)
      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: projectId,
        userId,
      })
      expect(mockProjectRepository.update).toHaveBeenCalledWith(
        projectId,
        updateData,
      )
    })

    test("should throw error when project not found", async () => {
      const userId = 1
      const projectId = 999
      const updateData = { name: "Updated Project Name" }

      mockProjectRepository.find.mockResolvedValue([])

      await expect(
        updateProject(deps, projectId, updateData, userId),
      ).rejects.toThrow("Project not found")

      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: projectId,
        userId,
      })
      expect(mockProjectRepository.update).not.toHaveBeenCalled()
    })

    test("should throw error when update fails", async () => {
      const userId = 1
      const projectId = 1
      const project = createRandomProject({ id: projectId, userId })
      const updateData = { name: "Updated Project Name" }

      mockProjectRepository.find.mockResolvedValue([project])
      mockProjectRepository.update.mockResolvedValue(null)

      await expect(
        updateProject(deps, projectId, updateData, userId),
      ).rejects.toThrow("Failed to update project")

      expect(mockProjectRepository.update).toHaveBeenCalledWith(
        projectId,
        updateData,
      )
    })

    test("should verify new parent exists when changing parent", async () => {
      const userId = 1
      const projectId = 1
      const newParentId = 2
      const project = createRandomProject({ id: projectId, userId })
      const parentProject = createRandomProject({ id: newParentId, userId })
      const updateData = { parentProjectId: newParentId }
      const updatedProject = { ...project, ...updateData }

      mockProjectRepository.find
        .mockResolvedValueOnce([project]) // First call for current project
        .mockResolvedValueOnce([parentProject]) // Second call for parent project
      mockProjectRepository.update.mockResolvedValue(updatedProject)

      const result = await updateProject(deps, projectId, updateData, userId)

      expect(result).toEqual(updatedProject)
      expect(mockProjectRepository.find).toHaveBeenCalledTimes(2)
      expect(mockProjectRepository.find).toHaveBeenNthCalledWith(1, {
        id: projectId,
        userId,
      })
      expect(mockProjectRepository.find).toHaveBeenNthCalledWith(2, {
        id: newParentId,
        userId,
      })
    })

    test("should throw error when new parent not found", async () => {
      const userId = 1
      const projectId = 1
      const newParentId = 999
      const project = createRandomProject({ id: projectId, userId })
      const updateData = { parentProjectId: newParentId }

      mockProjectRepository.find
        .mockResolvedValueOnce([project]) // First call for current project
        .mockResolvedValueOnce([]) // Second call for parent project (not found)

      await expect(
        updateProject(deps, projectId, updateData, userId),
      ).rejects.toThrow("Parent project not found")

      expect(mockProjectRepository.update).not.toHaveBeenCalled()
    })

    test("should throw error when project tries to be its own parent", async () => {
      const userId = 1
      const projectId = 1
      const project = createRandomProject({ id: projectId, userId })
      const updateData = { parentProjectId: projectId }

      mockProjectRepository.find.mockResolvedValue([project])

      await expect(
        updateProject(deps, projectId, updateData, userId),
      ).rejects.toThrow("Project cannot be its own parent")

      expect(mockProjectRepository.update).not.toHaveBeenCalled()
    })
  })

  describe("deleteProject", () => {
    test("should delete project successfully", async () => {
      const userId = 1
      const projectId = 1
      const project = createRandomProject({ id: projectId, userId })

      mockProjectRepository.find.mockResolvedValue([project])
      mockProjectRepository.findChildren.mockResolvedValue([])
      mockProjectRepository.delete.mockResolvedValue(true)

      await deleteProject(deps, projectId, userId)

      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: projectId,
        userId,
      })
      expect(mockProjectRepository.findChildren).toHaveBeenCalledWith(projectId)
      expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectId)
    })

    test("should throw error when project not found", async () => {
      const userId = 1
      const projectId = 999

      mockProjectRepository.find.mockResolvedValue([])

      await expect(deleteProject(deps, projectId, userId)).rejects.toThrow(
        "Project not found",
      )

      expect(mockProjectRepository.find).toHaveBeenCalledWith({
        id: projectId,
        userId,
      })
      expect(mockProjectRepository.findChildren).not.toHaveBeenCalled()
      expect(mockProjectRepository.delete).not.toHaveBeenCalled()
    })

    test("should throw error when project has child projects", async () => {
      const userId = 1
      const projectId = 1
      const project = createRandomProject({ id: projectId, userId })
      const childProjects = [
        createRandomProject({ id: 2, userId, parentProjectId: projectId }),
      ]

      mockProjectRepository.find.mockResolvedValue([project])
      mockProjectRepository.findChildren.mockResolvedValue(childProjects)

      await expect(deleteProject(deps, projectId, userId)).rejects.toThrow(
        "Cannot delete project with child projects",
      )

      expect(mockProjectRepository.findChildren).toHaveBeenCalledWith(projectId)
      expect(mockProjectRepository.delete).not.toHaveBeenCalled()
    })

    test("should throw error when delete fails", async () => {
      const userId = 1
      const projectId = 1
      const project = createRandomProject({ id: projectId, userId })

      mockProjectRepository.find.mockResolvedValue([project])
      mockProjectRepository.findChildren.mockResolvedValue([])
      mockProjectRepository.delete.mockResolvedValue(false)

      await expect(deleteProject(deps, projectId, userId)).rejects.toThrow(
        "Failed to delete project",
      )

      expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectId)
    })
  })
})
