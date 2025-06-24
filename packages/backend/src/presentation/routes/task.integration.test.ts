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

const createApp = async ({ deps }: Env, { user }: { user?: User } = {}) => {
  const testUser =
    user ?? (await deps.repository.user.create(createRandomUserData()))

  const app = new Hono()
    .use("*", mockAuth(testUser))
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
  })
})
