import { faker } from "@faker-js/faker"
import { beforeEach, describe, expect, it } from "vitest"
import {
  createRandomProject,
  createRandomProjectData,
} from "@/domain/entities/project.mock"
import {
  createRandomTask,
  createRandomTaskData,
} from "@/domain/entities/task.mock"
import {
  createRandomUser,
  createRandomUserData,
} from "@/domain/entities/user.mock"
import {
  ApiErrorSchema,
  ApiResponseSchema,
  ColorSchema,
  CommentSchema,
  CreateCommentSchema,
  CreateLabelSchema,
  CreateProjectSchema,
  CreateTaskSchema,
  CreateUserSchema,
  IdSchema,
  LabelSchema,
  PaginatedResponseSchema,
  ProjectSchema,
  TaskFilterSchema,
  TaskSchema,
  TimestampSchema,
  UpdateTaskSchema,
  UserSchema,
} from "./schema"

describe("Presentation Schema Validation", () => {
  beforeEach(() => {
    faker.seed(123)
  })

  describe("CreateTaskSchema", () => {
    it("should validate mock task data", () => {
      const mockTaskData = createRandomTaskData()
      // Convert Date to ISO string for schema validation
      const taskDataForValidation = {
        ...mockTaskData,
        dueDate: mockTaskData.dueDate?.toISOString() ?? null,
      }

      const result = CreateTaskSchema.safeParse(taskDataForValidation)
      expect(result.success).toBe(true)
    })

    it("should validate mock task data with minimal fields", () => {
      const mockTaskData = createRandomTaskData({
        description: undefined,
        priority: undefined,
        dueDate: undefined,
      })

      const result = CreateTaskSchema.safeParse(mockTaskData)
      expect(result.success).toBe(true)
    })

    it("should reject create task data without required fields", () => {
      const invalidData = {
        description: faker.lorem.paragraph(),
      }

      const result = CreateTaskSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject create task data with invalid types", () => {
      const invalidData = {
        projectId: faker.lorem.word(),
        title: faker.lorem.sentence(),
        priority: faker.lorem.word(),
      }

      const result = CreateTaskSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("UpdateTaskSchema", () => {
    it("should validate partial mock task data", () => {
      const mockTask = createRandomTask()
      const updateData = {
        title: mockTask.title,
        description: mockTask.description,
        priority: mockTask.priority,
      }

      const result = UpdateTaskSchema.safeParse(updateData)
      expect(result.success).toBe(true)
    })

    it("should validate single field updates", () => {
      const mockTask = createRandomTask()
      const partialData = {
        title: mockTask.title,
      }

      const result = UpdateTaskSchema.safeParse(partialData)
      expect(result.success).toBe(true)
    })

    it("should reject invalid field types", () => {
      const invalidData = {
        priority: faker.lorem.word(),
      }

      const result = UpdateTaskSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should validate empty update object", () => {
      const emptyData = {}
      const result = UpdateTaskSchema.safeParse(emptyData)
      expect(result.success).toBe(true)
    })
  })

  describe("TaskSchema", () => {
    it("should validate complete mock task object", () => {
      const mockTask = createRandomTask()
      // Convert dates to ISO strings for schema validation
      const taskForValidation = {
        ...mockTask,
        dueDate: mockTask.dueDate?.toISOString() ?? null,
        completedAt: mockTask.completedAt?.toISOString() ?? null,
        createdAt: mockTask.createdAt.toISOString(),
        updatedAt: mockTask.updatedAt.toISOString(),
        deletedAt: mockTask.deletedAt?.toISOString() ?? null,
      }

      const result = TaskSchema.safeParse(taskForValidation)
      expect(result.success).toBe(true)
    })

    it("should reject task object with missing required fields", () => {
      const invalidTask = {
        id: faker.number.int({ min: 1, max: 100 }),
        title: faker.lorem.sentence(),
      }

      const result = TaskSchema.safeParse(invalidTask)
      expect(result.success).toBe(false)
    })
  })

  describe("CreateUserSchema", () => {
    it("should validate mock user data", () => {
      const mockUserData = createRandomUserData()

      const result = CreateUserSchema.safeParse(mockUserData)
      expect(result.success).toBe(true)
    })

    it("should reject invalid email format", () => {
      const invalidData = {
        email: faker.lorem.word(),
        displayName: faker.person.fullName(),
      }

      const result = CreateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it("should reject empty displayName", () => {
      const invalidData = {
        email: faker.internet.email(),
        displayName: "",
      }

      const result = CreateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe("UserSchema", () => {
    it("should validate complete mock user object", () => {
      const mockUser = createRandomUser()
      // Convert dates to ISO strings for schema validation
      const userForValidation = {
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString(),
        deletedAt: mockUser.deletedAt?.toISOString() ?? null,
      }

      const result = UserSchema.safeParse(userForValidation)
      expect(result.success).toBe(true)
    })
  })

  describe("TaskFilterSchema", () => {
    it("should validate filter parameters with mock task status", () => {
      const mockTask = createRandomTask()
      const validFilters = {
        projectId: mockTask.projectId,
        status: mockTask.status,
        search: faker.lorem.words(),
        page: faker.number.int({ min: 1, max: 10 }),
        limit: faker.number.int({ min: 1, max: 100 }),
        dueBefore: faker.date.future().toISOString(),
      }

      const result = TaskFilterSchema.safeParse(validFilters)
      expect(result.success).toBe(true)
    })

    it("should validate empty filter object", () => {
      const emptyFilters = {}

      const result = TaskFilterSchema.safeParse(emptyFilters)
      expect(result.success).toBe(true)
    })

    it("should reject invalid page/limit values", () => {
      const invalidFilters = {
        page: 0, // Should be >= 1
        limit: 0, // Should be >= 1
      }

      const result = TaskFilterSchema.safeParse(invalidFilters)
      expect(result.success).toBe(false)
    })

    it("should reject limit over maximum", () => {
      const invalidFilters = {
        limit: 101, // Should be <= 100
      }

      const result = TaskFilterSchema.safeParse(invalidFilters)
      expect(result.success).toBe(false)
    })
  })

  describe("IdSchema", () => {
    it("should validate mock entity IDs", () => {
      const mockUser = createRandomUser()
      const mockTask = createRandomTask()
      const mockProject = createRandomProject()

      expect(IdSchema.safeParse(mockUser.id).success).toBe(true)
      expect(IdSchema.safeParse(mockTask.id).success).toBe(true)
      expect(IdSchema.safeParse(mockProject.id).success).toBe(true)
    })

    it("should reject zero", () => {
      const result = IdSchema.safeParse(0)
      expect(result.success).toBe(false)
    })

    it("should reject negative numbers", () => {
      const result = IdSchema.safeParse(
        faker.number.int({ min: -100, max: -1 }),
      )
      expect(result.success).toBe(false)
    })

    it("should reject non-integers", () => {
      const result = IdSchema.safeParse(faker.number.float())
      expect(result.success).toBe(false)
    })

    it("should reject strings", () => {
      const result = IdSchema.safeParse(faker.string.numeric())
      expect(result.success).toBe(false)
    })
  })

  describe("ApiResponseSchema", () => {
    it("should validate successful response with mock user", () => {
      const mockUser = createRandomUser()
      const validResponse = {
        success: true,
        data: {
          ...mockUser,
          createdAt: mockUser.createdAt.toISOString(),
          updatedAt: mockUser.updatedAt.toISOString(),
          deletedAt: mockUser.deletedAt?.toISOString() ?? null,
        },
      }

      const TestSchema = ApiResponseSchema(UserSchema)
      const result = TestSchema.safeParse(validResponse)
      expect(result.success).toBe(true)
    })
  })

  describe("ApiErrorSchema", () => {
    it("should validate error response", () => {
      const validError = {
        success: false,
        error: faker.lorem.slug(),
        message: faker.lorem.sentence(),
      }

      const result = ApiErrorSchema.safeParse(validError)
      expect(result.success).toBe(true)
    })

    it("should validate error response with details", () => {
      const validError = {
        success: false,
        error: faker.lorem.slug(),
        message: faker.lorem.sentence(),
        details: { field: faker.lorem.word(), reason: faker.lorem.sentence() },
      }

      const result = ApiErrorSchema.safeParse(validError)
      expect(result.success).toBe(true)
    })
  })

  describe("PaginatedResponseSchema", () => {
    it("should validate paginated response with mock users", () => {
      const mockUsers = Array.from({ length: 3 }, () => {
        const user = createRandomUser()
        return {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          deletedAt: user.deletedAt?.toISOString() ?? null,
        }
      })

      const validResponse = {
        data: mockUsers,
        total: faker.number.int({ min: 1, max: 100 }),
        page: faker.number.int({ min: 1, max: 10 }),
        limit: faker.number.int({ min: 1, max: 50 }),
        totalPages: faker.number.int({ min: 1, max: 10 }),
        success: true,
      }

      const TestSchema = PaginatedResponseSchema(UserSchema)
      const result = TestSchema.safeParse(validResponse)
      expect(result.success).toBe(true)
    })

    it("should reject paginated response with invalid data", () => {
      const invalidResponse = {
        data: faker.lorem.word(),
        total: faker.number.int({ min: 1, max: 100 }),
        page: faker.number.int({ min: 1, max: 10 }),
        limit: faker.number.int({ min: 1, max: 50 }),
        totalPages: faker.number.int({ min: 1, max: 10 }),
        success: true,
      }

      const TestSchema = PaginatedResponseSchema(UserSchema)
      const result = TestSchema.safeParse(invalidResponse)
      expect(result.success).toBe(false)
    })
  })

  describe("ColorSchema", () => {
    it("should validate mock project colors", () => {
      const mockProjects = Array.from({ length: 5 }, () =>
        createRandomProject(),
      )

      for (const project of mockProjects) {
        const result = ColorSchema.safeParse(project.color)
        expect(result.success).toBe(true)
      }
    })

    it("should validate standard hex colors", () => {
      const validColors = ["#FF5722", "#000000", "#ffffff", "#AbCdEf"]

      for (const color of validColors) {
        const result = ColorSchema.safeParse(color)
        expect(result.success).toBe(true)
      }
    })

    it("should reject invalid hex colors", () => {
      const invalidColors = ["FF5722", "#GG5722", "#FF572", "red", ""]

      for (const color of invalidColors) {
        const result = ColorSchema.safeParse(color)
        expect(result.success).toBe(false)
      }
    })
  })

  describe("TimestampSchema", () => {
    it("should validate mock entity timestamps", () => {
      const mockUser = createRandomUser()
      const mockTask = createRandomTask()
      const mockProject = createRandomProject()

      const timestamps = [
        mockUser.createdAt.toISOString(),
        mockUser.updatedAt.toISOString(),
        mockTask.createdAt.toISOString(),
        mockTask.updatedAt.toISOString(),
        mockProject.createdAt.toISOString(),
        mockProject.updatedAt.toISOString(),
      ]

      for (const timestamp of timestamps) {
        const result = TimestampSchema.safeParse(timestamp)
        expect(result.success).toBe(true)
      }
    })

    it("should reject non-string timestamps", () => {
      const invalidTimestamps = [new Date(), faker.number.int(), null]

      for (const timestamp of invalidTimestamps) {
        const result = TimestampSchema.safeParse(timestamp)
        expect(result.success).toBe(false)
      }
    })
  })

  describe("Project Schemas", () => {
    it("should validate mock ProjectSchema", () => {
      const mockProject = createRandomProject()
      const projectForValidation = {
        ...mockProject,
        createdAt: mockProject.createdAt.toISOString(),
        updatedAt: mockProject.updatedAt.toISOString(),
        deletedAt: mockProject.deletedAt?.toISOString() ?? null,
      }

      const result = ProjectSchema.safeParse(projectForValidation)
      expect(result.success).toBe(true)
    })

    it("should validate mock CreateProjectSchema", () => {
      const mockProjectData = createRandomProjectData()

      const result = CreateProjectSchema.safeParse(mockProjectData)
      expect(result.success).toBe(true)
    })
  })

  describe("Label Schemas", () => {
    it("should validate LabelSchema", () => {
      const validLabel = {
        id: faker.number.int({ min: 1, max: 100 }),
        userId: faker.number.int({ min: 1, max: 100 }),
        name: faker.lorem.word(),
        color: faker.color.rgb(),
        createdAt: faker.date.past().toISOString(),
      }

      const result = LabelSchema.safeParse(validLabel)
      expect(result.success).toBe(true)
    })

    it("should validate CreateLabelSchema", () => {
      const validData = {
        name: faker.lorem.word(),
        color: faker.color.rgb(),
      }

      const result = CreateLabelSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe("Comment Schemas", () => {
    it("should validate CommentSchema", () => {
      const validComment = {
        id: faker.number.int({ min: 1, max: 100 }),
        userId: faker.number.int({ min: 1, max: 100 }),
        commentableType: faker.helpers.arrayElement(["task", "project"]),
        commentableId: faker.number.int({ min: 1, max: 100 }),
        parentCommentId: null,
        content: faker.lorem.paragraph(),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        deletedAt: null,
      }

      const result = CommentSchema.safeParse(validComment)
      expect(result.success).toBe(true)
    })

    it("should validate CreateCommentSchema", () => {
      const validData = {
        content: faker.lorem.paragraph(),
        parentId: faker.number.int({ min: 1, max: 100 }),
      }

      const result = CreateCommentSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
