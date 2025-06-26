import assert from "node:assert"
import { Hono } from "hono"
import { testClient } from "hono/testing"
import { describe, expect } from "vitest"
import { createRandomProjectData } from "@/domain/entities/project.mock"
import { createRandomTaskData } from "@/domain/entities/task.mock"
import type { User } from "@/domain/entities/user"
import { createRandomUserData } from "@/domain/entities/user.mock"
import { mockAuth } from "@/test-helpers/auth"
import { type Env, it } from "@/test-helpers/db"
import { createTaskRoutes } from "./task"

type CreateAppOptions = {
  user?: User
  authenticated?: boolean
}

const createApp = async (
  { deps }: Env,
  { user, authenticated = true }: CreateAppOptions = {},
) => {
  const testUser =
    user ?? (await deps.repository.user.create(createRandomUserData()))

  const app = new Hono()
    .use("*", mockAuth(authenticated ? testUser : undefined))
    .route("/tasks", createTaskRoutes(deps))

  const client = testClient(app)

  return { app, client }
}

const asJson = <T>(data: T): T => JSON.parse(JSON.stringify(data))

describe("Task Routes Integration Tests", () => {
  describe("GET /tasks", () => {
    it("should return empty list when no tasks exists", async ({ env }) => {
      const { client } = await createApp(env)

      const res = await client.tasks.$get()
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(0)
    })

    it("should return tasks for the authenticated user", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: user.id,
        }),
      )
      const tasks = [
        await env.deps.repository.task.create(
          createRandomTaskData({
            userId: user.id,
            projectId: project.id,
          }),
        ),
        await env.deps.repository.task.create(
          createRandomTaskData({
            userId: user.id,
            projectId: project.id,
          }),
        ),
      ]

      const { client } = await createApp(env, { user })

      const res = await client.tasks.$get()
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(2)
      expect(data.data[0]).toMatchObject(asJson(tasks[0]))
      expect(data.data[1]).toMatchObject(asJson(tasks[1]))
    })

    it("should filter tasks by projectId", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project1 = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )
      const project2 = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )

      const task1 = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user.id, projectId: project1.id }),
      )
      await env.deps.repository.task.create(
        createRandomTaskData({ userId: user.id, projectId: project2.id }),
      )

      const { client } = await createApp(env, { user })

      const res = await client.tasks.$get({
        query: { projectId: project1.id.toString() },
      })
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0]).toMatchObject(asJson(task1))
    })

    it("should filter tasks by status", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )

      const pendingTask = await env.deps.repository.task.create(
        createRandomTaskData({
          userId: user.id,
          projectId: project.id,
        }),
      )
      const completedTask = await env.deps.repository.task.create(
        createRandomTaskData({
          userId: user.id,
          projectId: project.id,
        }),
      )
      // Update status after creation since status isn't part of CreateTaskData
      await env.deps.repository.task.update(completedTask.id, {
        status: "completed",
      })

      const { client } = await createApp(env, { user })

      const res = await client.tasks.$get({
        query: { status: "pending" },
      })
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0]).toMatchObject(asJson(pendingTask))
    })

    it("should search tasks by title", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )

      const matchingTask = await env.deps.repository.task.create(
        createRandomTaskData({
          userId: user.id,
          projectId: project.id,
          title: "Fix critical bug in authentication",
        }),
      )
      await env.deps.repository.task.create(
        createRandomTaskData({
          userId: user.id,
          projectId: project.id,
          title: "Add new feature to dashboard",
        }),
      )

      const { client } = await createApp(env, { user })

      const res = await client.tasks.$get({
        query: { search: "authentication" },
      })
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0]).toMatchObject(asJson(matchingTask))
    })

    it("should support pagination", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )

      // Create 5 tasks
      for (let i = 0; i < 5; i++) {
        await env.deps.repository.task.create(
          createRandomTaskData({ userId: user.id, projectId: project.id }),
        )
      }

      const { client } = await createApp(env, { user })

      const res = await client.tasks.$get({
        query: { page: "1", limit: "2" },
      })
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(2)
      expect(data.page).toBe(1)
      expect(data.limit).toBe(2)
      expect(data.total).toBe(5)
      expect(data.totalPages).toBe(3)
    })

    it("should not return tasks from other users", async ({ env }) => {
      const user1 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const user2 = await env.deps.repository.user.create(
        createRandomUserData(),
      )

      const project1 = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user1.id }),
      )
      const project2 = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user2.id }),
      )

      await env.deps.repository.task.create(
        createRandomTaskData({ userId: user1.id, projectId: project1.id }),
      )
      await env.deps.repository.task.create(
        createRandomTaskData({ userId: user2.id, projectId: project2.id }),
      )

      const { client } = await createApp(env, { user: user1 })

      const res = await client.tasks.$get()
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].userId).toBe(user1.id)
    })

    it("should return 401 for unauthenticated request", async ({ env }) => {
      const { app } = await createApp(env, { authenticated: false })
      const client = testClient(app)

      const res = await client.tasks.$get()
      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Unauthorized")
    })
  })

  describe("POST /tasks", () => {
    it("should create tasks", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({
          userId: user.id,
        }),
      )

      const { client } = await createApp(env, { user })

      const taskDataToCreate = createRandomTaskData({ projectId: project.id })
      const res = await client.tasks.$post({
        json: taskDataToCreate,
      })
      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toMatchObject({
        ...asJson(taskDataToCreate),
        userId: user.id,
      })
    })

    it("should create task with minimal data", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )

      const { client } = await createApp(env, { user })

      const minimalTaskData = {
        projectId: project.id,
        title: "Simple task",
      }

      const res = await client.tasks.$post({
        json: minimalTaskData,
      })
      expect(res.status).toBe(201)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data.title).toBe(minimalTaskData.title)
      expect(data.data.projectId).toBe(project.id)
      expect(data.data.userId).toBe(user.id)
      expect(data.data.description).toBeNull()
      expect(data.data.priority).toBe(0)
      expect(data.data.dueDate).toBeNull()
      expect(data.data.completedAt).toBeNull()
      expect(data.data.status).toBe("pending")
      expect(data.data.path).toBeNull()
      expect(data.data.depth).toBe(0)
      expect(data.data.createdAt).toBeDefined()
      expect(data.data.updatedAt).toBeDefined()
      expect(data.data.deletedAt).toBeNull()
      expect(data.data.id).toBeDefined()
      expect(data.data.parentTaskId).toBeNull()
    })

    it("should return 401 for unauthenticated request", async ({ env }) => {
      const { app } = await createApp(env, { authenticated: false })
      const client = testClient(app)

      const res = await client.tasks.$post({
        json: { title: "Test task", projectId: 1 },
      })
      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Unauthorized")
    })
  })

  describe("GET /tasks/:id", () => {
    it("should return task by id", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user.id, projectId: project.id }),
      )

      const { client } = await createApp(env, { user })

      const res = await client.tasks[":id"].$get({
        param: { id: task.id.toString() },
      })
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toMatchObject(asJson(task))
    })

    it("should return 404 for non-existent task", async ({ env }) => {
      const { client } = await createApp(env)

      const res = await client.tasks[":id"].$get({
        param: { id: "100" },
      })
      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Task not found")
    })

    it("should return 404 for task belonging to different user", async ({
      env,
    }) => {
      const user1 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const user2 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user2.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user2.id, projectId: project.id }),
      )

      const { client } = await createApp(env, { user: user1 })

      const res = await client.tasks[":id"].$get({
        param: { id: task.id.toString() },
      })
      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Task not found")
    })

    it("should return 401 for unauthenticated request", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user.id, projectId: project.id }),
      )

      const { app } = await createApp(env, { authenticated: false })
      const client = testClient(app)

      const res = await client.tasks[":id"].$get({
        param: { id: task.id.toString() },
      })
      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Unauthorized")
    })
  })

  describe("PUT /tasks/:id", () => {
    it("should update task", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user.id, projectId: project.id }),
      )

      const { client } = await createApp(env, { user })

      const updateData = {
        title: "Updated task title",
        description: "Updated description",
        priority: 1,
      }

      const res = await client.tasks[":id"].$put({
        param: { id: task.id.toString() },
        json: updateData,
      })
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data).toMatchObject({
        id: task.id,
        title: updateData.title,
        description: updateData.description,
        priority: updateData.priority,
      })
    })

    it("should return 404 when updating non-existent task", async ({ env }) => {
      const { client } = await createApp(env)

      const res = await client.tasks[":id"].$put({
        param: { id: "100" },
        json: { title: "Updated title" },
      })
      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Task not found")
    })

    it("should not allow updating task from different user", async ({
      env,
    }) => {
      const user1 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const user2 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user2.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user2.id, projectId: project.id }),
      )

      const { client } = await createApp(env, { user: user1 })

      const res = await client.tasks[":id"].$put({
        param: { id: task.id.toString() },
        json: { title: "Hacked title" },
      })
      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Task not found")
    })

    it("should return 401 for unauthenticated request", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user.id, projectId: project.id }),
      )

      const { app } = await createApp(env, { authenticated: false })
      const client = testClient(app)

      const res = await client.tasks[":id"].$put({
        param: { id: task.id.toString() },
        json: { title: "Updated title" },
      })
      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Unauthorized")
    })
  })

  describe("POST /tasks/:id/complete", () => {
    it("should complete task", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({
          userId: user.id,
          projectId: project.id,
        }),
      )

      const { client } = await createApp(env, { user })

      const res = await client.tasks[":id"].complete.$post({
        param: { id: task.id.toString() },
      })
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data.status).toBe("completed")
      expect(data.data.completedAt).toBeDefined()
    })

    it("should return 404 when completing non-existent task", async ({
      env,
    }) => {
      const { client } = await createApp(env)

      const res = await client.tasks[":id"].complete.$post({
        param: { id: "100" },
      })
      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Task not found")
    })

    it("should not allow completing task from different user", async ({
      env,
    }) => {
      const user1 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const user2 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user2.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user2.id, projectId: project.id }),
      )

      const { client } = await createApp(env, { user: user1 })

      const res = await client.tasks[":id"].complete.$post({
        param: { id: task.id.toString() },
      })
      expect(res.status).toBe(404)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Task not found")
    })

    it("should return 401 for unauthenticated request", async ({ env }) => {
      const { app } = await createApp(env, { authenticated: false })
      const client = testClient(app)

      const res = await client.tasks[":id"].complete.$post({
        param: { id: "1" },
      })
      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Unauthorized")
    })
  })

  describe("DELETE /tasks/:id", () => {
    it("should delete task", async ({ env }) => {
      const user = await env.deps.repository.user.create(createRandomUserData())
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user.id, projectId: project.id }),
      )

      const { client } = await createApp(env, { user })

      const res = await client.tasks[":id"].$delete({
        param: { id: task.id.toString() },
      })
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.success).toBe(true)
      assert(data.success === true)
      expect(data.data.success).toBe(true)

      // Verify task is soft deleted
      const deletedTasks = await env.deps.repository.task.find({
        id: task.id,
        includeDeleted: true,
      })
      const deletedTask = deletedTasks[0]
      expect(deletedTask?.deletedAt).toBeDefined()
    })

    it("should return 500 when deleting non-existent task", async ({ env }) => {
      const { client } = await createApp(env)

      const res = await client.tasks[":id"].$delete({
        param: { id: "100" },
      })
      expect(res.status).toBe(500)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      assert(data.success === false)
      expect(data.error).toBe("Failed to delete task")
    })

    it("should return 500 when deleting task from different user", async ({
      env,
    }) => {
      const user1 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const user2 = await env.deps.repository.user.create(
        createRandomUserData(),
      )
      const project = await env.deps.repository.project.create(
        createRandomProjectData({ userId: user2.id }),
      )
      const task = await env.deps.repository.task.create(
        createRandomTaskData({ userId: user2.id, projectId: project.id }),
      )

      const { client } = await createApp(env, { user: user1 })

      const res = await client.tasks[":id"].$delete({
        param: { id: task.id.toString() },
      })
      expect(res.status).toBe(500)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      assert(data.success === false)
      expect(data.error).toBe("Failed to delete task")
    })

    it("should return 401 for unauthenticated request", async ({ env }) => {
      const { app } = await createApp(env, { authenticated: false })
      const client = testClient(app)

      const res = await client.tasks[":id"].$delete({
        param: { id: "1" },
      })
      expect(res.status).toBe(401)

      const data = await res.json()
      expect(data.success).toBe(false)
      assert(data.success === false)
      expect(data.error).toBe("Unauthorized")
    })
  })
})
