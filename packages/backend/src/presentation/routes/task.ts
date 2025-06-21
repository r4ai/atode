import { Hono } from "hono"
import { dependencies } from "../dependencies"
import {
  getTask,
  createTask,
  updateTask,
  getTasks,
  completeTask,
  deleteTask,
} from "../controllers/task"

const taskRoutes = new Hono()

// GET /api/tasks - List tasks with filtering
taskRoutes.get("/", getTasks(dependencies))

// POST /api/tasks - Create new task
taskRoutes.post("/", createTask(dependencies))

// GET /api/tasks/:id - Get task with details
taskRoutes.get("/:id", getTask(dependencies))

// PUT /api/tasks/:id - Update task
taskRoutes.put("/:id", updateTask(dependencies))

// POST /api/tasks/:id/complete - Mark task complete
taskRoutes.post("/:id/complete", completeTask(dependencies))

// DELETE /api/tasks/:id - Delete task
taskRoutes.delete("/:id", deleteTask(dependencies))

export { taskRoutes }
