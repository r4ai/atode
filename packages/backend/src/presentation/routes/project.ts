import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver, validator as zValidator } from "hono-openapi/zod"
import { z } from "zod"
import type {
  CreateProjectData,
  UpdateProjectData,
} from "@/domain/entities/project"
import {
  createProject,
  deleteProject,
  getChildProjects,
  getProject,
  getProjects,
  updateProject,
} from "@/domain/use-cases/project"
import type { Dependencies } from "@/presentation/dependencies"
import {
  ApiErrorSchema,
  ApiResponseSchema,
  CreateProjectSchema,
  IdParamSchema,
  ProjectFilterSchema,
  ProjectSchema,
  UpdateProjectSchema,
} from "@/presentation/schema"

export const createProjectRoutes = (deps: Dependencies) => {
  const projectRoutes = new Hono()

    // GET /projects - List projects with hierarchy
    .get(
      "/",
      describeRoute({
        tags: ["projects"],
        summary: "List projects",
        description: "Get a list of user projects with optional filtering",
        responses: {
          200: {
            description: "List of projects",
            content: {
              "application/json": {
                schema: resolver(
                  z.object({
                    data: z.array(ProjectSchema),
                    success: z.boolean(),
                  }),
                ),
              },
            },
          },
          400: {
            description: "Invalid request parameters",
            content: {
              "application/json": {
                schema: resolver(ApiErrorSchema),
              },
            },
          },
        },
      }),
      zValidator("query", ProjectFilterSchema.optional()),
      async (c) => {
        try {
          const session = c.get("authUser")
          if (!session?.user?.email) {
            return c.json(
              {
                success: false,
                error: "Unauthorized",
                message: "User not authenticated",
              } as const,
              401,
            )
          }

          // Get user from database to get the ID
          const users = await deps.repository.user.find({
            email: session.user.email,
          })
          const user = users[0] ?? null
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const projects = await getProjects(deps, user.id)

          return c.json({
            data: projects,
            success: true,
          } as const)
        } catch (error) {
          return c.json(
            {
              success: false,
              error: "Failed to fetch projects",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // POST /projects - Create new project
    .post(
      "/",
      describeRoute({
        tags: ["projects"],
        summary: "Create project",
        description: "Create a new project",
        responses: {
          201: {
            description: "Project created successfully",
            content: {
              "application/json": {
                schema: resolver(ApiResponseSchema(ProjectSchema)),
              },
            },
          },
          400: {
            description: "Invalid request data",
            content: {
              "application/json": {
                schema: resolver(ApiErrorSchema),
              },
            },
          },
        },
      }),
      zValidator("json", CreateProjectSchema),
      async (c) => {
        const data = c.req.valid("json")

        try {
          const session = c.get("authUser")
          if (!session?.user?.email) {
            return c.json(
              {
                success: false,
                error: "Unauthorized",
                message: "User not authenticated",
              } as const,
              401,
            )
          }

          // Get user from database to get the ID
          const users = await deps.repository.user.find({
            email: session.user.email,
          })
          const user = users[0] ?? null
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const projectData: CreateProjectData = {
            userId: user.id,
            parentProjectId: data.parentId,
            name: data.name,
            description: data.description,
            color: data.color,
          }

          const project = await createProject(deps, projectData)

          return c.json(
            {
              data: project,
              success: true,
              message: "Project created successfully",
            } as const,
            201,
          )
        } catch (error) {
          return c.json(
            {
              success: false,
              error: "Failed to create project",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // GET /projects/:id - Get project details
    .get(
      "/:id",
      describeRoute({
        tags: ["projects"],
        summary: "Get project",
        description: "Get a specific project by ID",
        responses: {
          200: {
            description: "Project details",
            content: {
              "application/json": {
                schema: resolver(ApiResponseSchema(ProjectSchema)),
              },
            },
          },
          404: {
            description: "Project not found",
            content: {
              "application/json": {
                schema: resolver(ApiErrorSchema),
              },
            },
          },
        },
      }),
      zValidator("param", z.object({ id: IdParamSchema })),
      async (c) => {
        const { id } = c.req.valid("param")

        try {
          const session = c.get("authUser")
          if (!session?.user?.email) {
            return c.json(
              {
                success: false,
                error: "Unauthorized",
                message: "User not authenticated",
              } as const,
              401,
            )
          }

          // Get user from database to get the ID
          const users = await deps.repository.user.find({
            email: session.user.email,
          })
          const user = users[0] ?? null
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const project = await getProject(deps, id, user.id)

          if (!project) {
            return c.json(
              {
                success: false,
                error: "Project not found",
                message: `Project with ID ${id} not found`,
              } as const,
              404,
            )
          }

          return c.json({
            data: project,
            success: true,
          } as const)
        } catch (error) {
          return c.json(
            {
              success: false,
              error: "Failed to fetch project",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // GET /projects/:id/children - Get child projects
    .get(
      "/:id/children",
      describeRoute({
        tags: ["projects"],
        summary: "Get child projects",
        description: "Get all child projects of a specific project",
        responses: {
          200: {
            description: "List of child projects",
            content: {
              "application/json": {
                schema: resolver(
                  z.object({
                    data: z.array(ProjectSchema),
                    success: z.boolean(),
                  }),
                ),
              },
            },
          },
          404: {
            description: "Project not found",
            content: {
              "application/json": {
                schema: resolver(ApiErrorSchema),
              },
            },
          },
        },
      }),
      zValidator("param", z.object({ id: IdParamSchema })),
      async (c) => {
        const { id } = c.req.valid("param")

        try {
          const session = c.get("authUser")
          if (!session?.user?.email) {
            return c.json(
              {
                success: false,
                error: "Unauthorized",
                message: "User not authenticated",
              } as const,
              401,
            )
          }

          // Get user from database to get the ID
          const users = await deps.repository.user.find({
            email: session.user.email,
          })
          const user = users[0] ?? null
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const childProjects = await getChildProjects(deps, id, user.id)

          return c.json({
            data: childProjects,
            success: true,
          } as const)
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Parent project not found"
          ) {
            return c.json(
              {
                success: false,
                error: "Project not found",
                message: `Project with ID ${id} not found`,
              } as const,
              404,
            )
          }

          return c.json(
            {
              success: false,
              error: "Failed to fetch child projects",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // PUT /projects/:id - Update project
    .put(
      "/:id",
      describeRoute({
        tags: ["projects"],
        summary: "Update project",
        description: "Update an existing project",
        responses: {
          200: {
            description: "Project updated successfully",
            content: {
              "application/json": {
                schema: resolver(ApiResponseSchema(ProjectSchema)),
              },
            },
          },
          404: {
            description: "Project not found",
            content: {
              "application/json": {
                schema: resolver(ApiErrorSchema),
              },
            },
          },
        },
      }),
      zValidator("param", z.object({ id: IdParamSchema })),
      zValidator("json", UpdateProjectSchema),
      async (c) => {
        // Check authentication first
        const session = c.get("authUser")
        if (!session?.user?.email) {
          return c.json(
            {
              success: false,
              error: "Unauthorized",
              message: "User not authenticated",
            } as const,
            401,
          )
        }

        const { id: idParam } = c.req.valid("param")
        const data = c.req.valid("json")

        // Convert to number and validate
        const id = Number(idParam)
        if (Number.isNaN(id) || id <= 0) {
          return c.json(
            {
              success: false,
              error: "Project not found",
              message: `Project with ID ${idParam} not found`,
            } as const,
            404,
          )
        }

        try {
          // Get user from database to get the ID
          const users = await deps.repository.user.find({
            email: session.user.email,
          })
          const user = users[0] ?? null
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          const updateData: UpdateProjectData = {
            parentProjectId: data.parentId,
            name: data.name,
            description: data.description,
            color: data.color,
          }

          const project = await updateProject(deps, id, updateData, user.id)

          return c.json({
            data: project,
            success: true,
            message: "Project updated successfully",
          } as const)
        } catch (error) {
          if (error instanceof Error && error.message === "Project not found") {
            return c.json(
              {
                success: false,
                error: "Project not found",
                message: `Project with ID ${id} not found`,
              } as const,
              404,
            )
          }

          if (error instanceof Error && error.message.includes("circular")) {
            return c.json(
              {
                success: false,
                error: "Invalid request",
                message: error.message,
              } as const,
              400,
            )
          }

          return c.json(
            {
              success: false,
              error: "Failed to update project",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

    // DELETE /projects/:id - Delete project
    .delete(
      "/:id",
      describeRoute({
        tags: ["projects"],
        summary: "Delete project",
        description: "Soft delete a project",
        responses: {
          200: {
            description: "Project deleted successfully",
            content: {
              "application/json": {
                schema: resolver(
                  ApiResponseSchema(
                    z.object({
                      success: z.boolean(),
                    }),
                  ),
                ),
              },
            },
          },
          404: {
            description: "Project not found",
            content: {
              "application/json": {
                schema: resolver(ApiErrorSchema),
              },
            },
          },
        },
      }),
      zValidator("param", z.object({ id: IdParamSchema })),
      async (c) => {
        const { id } = c.req.valid("param")

        // Check authentication first
        const session = c.get("authUser")
        if (!session?.user?.email) {
          return c.json(
            {
              success: false,
              error: "Unauthorized",
              message: "User not authenticated",
            } as const,
            401,
          )
        }

        try {
          // Get user from database to get the ID
          const users = await deps.repository.user.find({
            email: session.user.email,
          })
          const user = users[0] ?? null
          if (!user || user.deletedAt) {
            return c.json(
              {
                success: false,
                error: "User not found",
                message: "User not found in database",
              } as const,
              404,
            )
          }

          await deleteProject(deps, id, user.id)

          return c.json({
            data: { success: true },
            success: true,
            message: "Project deleted successfully",
          } as const)
        } catch (error) {
          if (error instanceof Error && error.message === "Project not found") {
            return c.json(
              {
                success: false,
                error: "Project not found",
                message: `Project with ID ${id} not found`,
              } as const,
              404,
            )
          }

          if (
            error instanceof Error &&
            error.message.includes("child projects")
          ) {
            return c.json(
              {
                success: false,
                error: "Cannot delete project",
                message: error.message,
              } as const,
              400,
            )
          }

          return c.json(
            {
              success: false,
              error: "Failed to delete project",
              message: error instanceof Error ? error.message : "Unknown error",
            } as const,
            500,
          )
        }
      },
    )

  return projectRoutes
}
