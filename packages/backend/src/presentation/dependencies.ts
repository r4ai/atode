// Simple dependency composition without classes
import { taskRepository } from "@/infrastructure/repositories/task"
import { userRepository } from "@/infrastructure/repositories/user"

// Create a simple dependencies object
export const dependencies = {
  repository: {
    task: taskRepository,
    user: userRepository,
    // TODO: Mock project repository for now - in a real app this would be implemented
    project: {
      findById: async (id: number) => ({
        id,
        userId: 1, // Mock user ID - in real app this would come from auth
        name: "Default Project",
        description: null,
        color: "#3b82f6",
        path: null,
        depth: 0,
        parentProjectId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    },
  } as any,
}

export type Dependencies = typeof dependencies
