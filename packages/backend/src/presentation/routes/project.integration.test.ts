import assert from "node:assert"
import { Hono } from "hono"
import { testClient } from "hono/testing"
import { describe, expect } from "vitest"
import { createRandomProjectData } from "@/domain/entities/project.mock"
import type { User } from "@/domain/entities/user"
import { createRandomUserData } from "@/domain/entities/user.mock"
import { mockAuth } from "@/test-helpers/auth"
import { type Env, it } from "@/test-helpers/db"
import { createProjectRoutes } from "./project"

const createApp = async ({ deps }: Env, { user }: { user?: User } = {}) => {
  const testUser =
    user ?? (await deps.repository.user.create(createRandomUserData()))

  const app = new Hono()
    .use("*", mockAuth(testUser))
    .route("/projects", createProjectRoutes(deps))

  const client = testClient(app)

  return { app, client, testUser }
}

describe("Project Routes Integration Tests", () => {
  describe("GET /projects", () => {
    it("should return empty list when no projects exist", async ({ env }) => {
      const { client } = await createApp(env)

      const res = await client.projects.$get()
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(0)
    })

    it("should return projects for the authenticated user", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      await env.deps.repository.project.create(
        createRandomProjectData({
          userId: user.id,
          name: "Project 1",
        }),
      )
      await env.deps.repository.project.create(
        createRandomProjectData({
          userId: user.id,
          name: "Project 2",
        }),
      )

      const { client } = await createApp(env, { user })

      const res = await client.projects.$get()
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(2)
      expect(data.data.map((p) => p.name)).toEqual(
        expect.arrayContaining(["Project 1", "Project 2"]),
      )
    })

    it("should not return projects from other users", async ({ env }) => {
      const user1 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const user2 = await env.deps.repository.user.create(
        createRandomUserData(),
      )

      // Create project for user1
      await env.deps.repository.project.create(
        createRandomProjectData({
          userId: user1.id,
          name: "User1 Project",
        }),
      )

      // Create project for user2
      await env.deps.repository.project.create(
        createRandomProjectData({
          userId: user2.id,
          name: "User2 Project",
        }),
      )

      // Request as user1
      const { client } = await createApp(env, { user: user1 })

      const res = await client.projects.$get()
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe("User1 Project")
    })
  })

  describe("POST /projects", () => {
    it("should create project successfully", async ({ env }) => {
      const { client, testUser } = await createApp(env)

      const projectData = {
        name: "New Project",
        description: "A new project",
        color: "#4CAF50",
      }

      const res = await client.projects.$post({
        json: projectData,
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toMatchObject({
        name: "New Project",
        description: "A new project",
        color: "#4CAF50",
        userId: testUser.id,
        depth: 0,
      })
    })

    it("should create project with parent", async ({ env }) => {
      const { client, testUser } = await createApp(env)

      // Create parent project first
      const parentProject = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          name: "Parent Project",
        }),
      )

      const projectData = {
        name: "Child Project",
        description: "A child project",
        parentId: parentProject.id,
      }

      const res = await client.projects.$post({
        json: projectData,
      })

      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toMatchObject({
        name: "Child Project",
        description: "A child project",
        parentProjectId: parentProject.id,
        userId: testUser.id,
      })
    })

    it("should return error when parent project not found", async ({ env }) => {
      const { client } = await createApp(env)

      const projectData = {
        name: "Child Project",
        parentId: 999,
      }

      const res = await client.projects.$post({
        json: projectData,
      })

      expect(res.status).toBe(500)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.message).toContain("Parent project not found")
    })

    it("should return error when parent project belongs to different user", async ({
      env,
    }) => {
      const user1 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const user2 = await env.deps.repository.user.create(
        createRandomUserData(),
      )

      // Create parent project for user1
      const parentProject = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: user1.id,
          name: "User1 Project",
        }),
      )

      // Try to create child project as user2
      const { client } = await createApp(env, { user: user2 })

      const projectData = {
        name: "Child Project",
        parentId: parentProject.id,
      }

      const res = await client.projects.$post({
        json: projectData,
      })

      expect(res.status).toBe(500)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.message).toContain("Parent project not found")
    })
  })

  describe("GET /projects/:id", () => {
    it("should return project by id", async ({ env }) => {
      const { client, testUser } = await createApp(env)

      const project = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          name: "Test Project",
          description: "Test description",
        }),
      )

      const res = await client.projects[":id"].$get({
        param: { id: project.id.toString() },
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toMatchObject({
        id: project.id,
        name: "Test Project",
        description: "Test description",
        userId: testUser.id,
      })
    })

    it("should return 404 when project not found", async ({ env }) => {
      const { client } = await createApp(env)

      const res = await client.projects[":id"].$get({
        param: { id: "999" },
      })

      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Project not found")
    })

    it("should return 404 when project belongs to different user", async ({
      env,
    }) => {
      const user1 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const user2 = await env.deps.repository.user.create(
        createRandomUserData(),
      )

      // Create project for user1
      const project = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: user1.id,
          name: "User1 Project",
        }),
      )

      // Try to access as user2
      const { client } = await createApp(env, { user: user2 })

      const res = await client.projects[":id"].$get({
        param: { id: project.id.toString() },
      })

      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Project not found")
    })
  })

  describe("GET /projects/:id/children", () => {
    it("should return child projects", async ({ env }) => {
      const { client, testUser } = await createApp(env)

      const parentProject = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          name: "Parent Project",
        }),
      )

      await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          parentProjectId: parentProject.id,
          name: "Child 1",
        }),
      )
      await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          parentProjectId: parentProject.id,
          name: "Child 2",
        }),
      )

      const res = await client.projects[":id"].children.$get({
        param: { id: parentProject.id.toString() },
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(2)
      expect(data.data.map((p) => p.name)).toEqual(
        expect.arrayContaining(["Child 1", "Child 2"]),
      )
      expect(
        data.data.every((p) => p.parentProjectId === parentProject.id),
      ).toBe(true)
    })

    it("should return empty array when no child projects exist", async ({
      env,
    }) => {
      const { client, testUser } = await createApp(env)

      const parentProject = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          name: "Parent Project",
        }),
      )

      const res = await client.projects[":id"].children.$get({
        param: { id: parentProject.id.toString() },
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(0)
    })

    it("should return 404 when parent project not found", async ({ env }) => {
      const { client } = await createApp(env)

      const res = await client.projects[":id"].children.$get({
        param: { id: "999" },
      })

      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Project not found")
    })
  })

  describe("PUT /projects/:id", () => {
    it("should update project successfully", async ({ env }) => {
      const { client, testUser } = await createApp(env)

      const project = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          name: "Original Project",
          description: "Original description",
        }),
      )

      const updateData = {
        name: "Updated Project",
        description: "Updated description",
        color: "#2196F3",
      }

      const res = await client.projects[":id"].$put({
        param: { id: project.id.toString() },
        json: updateData,
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toMatchObject({
        id: project.id,
        name: "Updated Project",
        description: "Updated description",
        color: "#2196F3",
      })
    })

    it("should return 404 when project not found", async ({ env }) => {
      const { client } = await createApp(env)

      const updateData = { name: "Updated Project" }

      const res = await client.projects[":id"].$put({
        param: { id: "999" },
        json: updateData,
      })

      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Project not found")
    })

    it("should return 400 when trying to set circular parent reference", async ({
      env,
    }) => {
      const { client, testUser } = await createApp(env)

      const project = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          name: "Test Project",
        }),
      )

      const updateData = {
        parentId: project.id, // Circular reference
      }

      const res = await client.projects[":id"].$put({
        param: { id: project.id.toString() },
        json: updateData,
      })

      expect(res.status).toBe(400)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.message).toContain("cannot be its own parent")
    })
  })

  describe("DELETE /projects/:id", () => {
    it("should delete project successfully", async ({ env }) => {
      const { client, testUser } = await createApp(env)

      const project = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          name: "Project to Delete",
        }),
      )

      const res = await client.projects[":id"].$delete({
        param: { id: project.id.toString() },
      })

      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data.success).toBe(true)

      // Verify project was soft deleted
      const deletedProject = await env.deps.repository.project.find({
        id: project.id,
        userId: testUser.id,
      })
      expect(deletedProject).toHaveLength(0)
    })

    it("should return 404 when project not found", async ({ env }) => {
      const { client } = await createApp(env)

      const res = await client.projects[":id"].$delete({
        param: { id: "999" },
      })

      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Project not found")
    })

    it("should return 400 when project has child projects", async ({ env }) => {
      const { client, testUser } = await createApp(env)

      const parentProject = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          name: "Parent Project",
        }),
      )

      await env.deps.repository.project.create(
        createRandomProjectData({
          userId: testUser.id,
          parentProjectId: parentProject.id,
          name: "Child Project",
        }),
      )

      const res = await client.projects[":id"].$delete({
        param: { id: parentProject.id.toString() },
      })

      expect(res.status).toBe(400)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Cannot delete project")
      expect(data.message).toContain("child projects")
    })
  })
})
