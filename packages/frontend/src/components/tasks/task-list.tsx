import { Circle, MoreVertical, Plus, Star } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Priority = "low" | "medium" | "high" | "urgent"

type Task = {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  dueDate?: string
  projectId?: string
  starred: boolean
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review the quarterly budget report",
    description: "Check all numbers and prepare for the meeting",
    completed: false,
    priority: "high",
    dueDate: "2024-06-25",
    projectId: "2",
    starred: true,
  },
  {
    id: "2",
    title: "Buy groceries for the week",
    completed: false,
    priority: "medium",
    dueDate: "2024-06-24",
    projectId: "3",
    starred: false,
  },
  {
    id: "3",
    title: "Call dentist for appointment",
    completed: true,
    priority: "low",
    projectId: "1",
    starred: false,
  },
  {
    id: "4",
    title: "Finish project documentation",
    description: "Complete the API documentation and deployment guide",
    completed: false,
    priority: "urgent",
    dueDate: "2024-06-24",
    projectId: "2",
    starred: false,
  },
]

const priorityColors = {
  low: "border-l-gray-300",
  medium: "border-l-yellow-400",
  high: "border-l-orange-500",
  urgent: "border-l-red-500",
}

type TaskListProps = {
  title: string
  showCompleted?: boolean
  projectFilter?: string
}

export const TaskList = ({
  title,
  showCompleted = true,
  projectFilter,
}: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    if (!showCompleted && task.completed) return false
    if (projectFilter && task.projectId !== projectFilter) return false
    return true
  })

  const toggleTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const toggleStar = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, starred: !task.starred } : task,
      ),
    )
  }

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: "medium",
      starred: false,
      projectId: projectFilter,
    }

    setTasks((prevTasks) => [newTask, ...prevTasks])
    setNewTaskTitle("")
    setIsAddingTask(false)
  }

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    }
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
          {title}
        </h2>
        <Button
          onClick={() => setIsAddingTask(true)}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Add Task Input */}
      {isAddingTask && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <Input
            placeholder="Task name"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask()
              } else if (e.key === "Escape") {
                setIsAddingTask(false)
                setNewTaskTitle("")
              }
            }}
            autoFocus
          />
          <div className="mt-3 flex gap-2">
            <Button onClick={addTask} size="sm">
              Add Task
            </Button>
            <Button
              onClick={() => {
                setIsAddingTask(false)
                setNewTaskTitle("")
              }}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Circle className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              No tasks yet
            </h3>
            <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
              Get started by creating your first task
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group rounded-lg border border-gray-200 border-l-4 bg-white p-4 transition-all hover:shadow-sm dark:border-gray-700 dark:bg-gray-800",
                priorityColors[task.priority],
                task.completed && "opacity-60",
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-1"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3
                        className={cn(
                          "font-medium text-gray-900 dark:text-gray-100",
                          task.completed &&
                            "text-gray-500 line-through dark:text-gray-400",
                        )}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs">
                        {task.dueDate && (
                          <span className="text-gray-500 dark:text-gray-400">
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                        <span
                          className={cn(
                            "rounded px-2 py-1 font-medium text-xs",
                            {
                              "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300":
                                task.priority === "low",
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400":
                                task.priority === "medium",
                              "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400":
                                task.priority === "high",
                              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400":
                                task.priority === "urgent",
                            },
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStar(task.id)}
                        className={cn(
                          "h-8 w-8 p-0",
                          task.starred ? "text-yellow-500" : "text-gray-400",
                        )}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            task.starred && "fill-current",
                          )}
                        />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Move to Project</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
