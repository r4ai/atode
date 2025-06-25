import { useSession } from "@hono/auth-js/react"
import { createFileRoute } from "@tanstack/react-router"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserMenu } from "@/components/auth/user-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Dashboard = () => {
  const session = useSession()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="border-gray-200 border-b bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                  Atode Dashboard
                </h1>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back, {session.data?.user?.name}!</CardTitle>
                <CardDescription>
                  Here's an overview of your tasks and projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
                    <h3 className="font-medium text-blue-900 text-lg dark:text-blue-100">
                      Tasks
                    </h3>
                    <p className="mt-2 font-bold text-3xl text-blue-600 dark:text-blue-400">
                      0
                    </p>
                    <p className="mt-1 text-blue-600 text-sm dark:text-blue-400">
                      Total tasks
                    </p>
                  </div>

                  <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
                    <h3 className="font-medium text-green-900 text-lg dark:text-green-100">
                      Projects
                    </h3>
                    <p className="mt-2 font-bold text-3xl text-green-600 dark:text-green-400">
                      0
                    </p>
                    <p className="mt-1 text-green-600 text-sm dark:text-green-400">
                      Active projects
                    </p>
                  </div>

                  <div className="rounded-lg bg-purple-50 p-6 dark:bg-purple-900/20">
                    <h3 className="font-medium text-lg text-purple-900 dark:text-purple-100">
                      Completed
                    </h3>
                    <p className="mt-2 font-bold text-3xl text-purple-600 dark:text-purple-400">
                      0
                    </p>
                    <p className="mt-1 text-purple-600 text-sm dark:text-purple-400">
                      This week
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 font-medium text-gray-900 text-lg dark:text-gray-100">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <div className="font-medium text-gray-900 text-sm dark:text-gray-100">
                        Create Task
                      </div>
                      <div className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                        Add a new task to your list
                      </div>
                    </button>

                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <div className="font-medium text-gray-900 text-sm dark:text-gray-100">
                        New Project
                      </div>
                      <div className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                        Start organizing with projects
                      </div>
                    </button>

                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <div className="font-medium text-gray-900 text-sm dark:text-gray-100">
                        View All Tasks
                      </div>
                      <div className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                        See your complete task list
                      </div>
                    </button>

                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <div className="font-medium text-gray-900 text-sm dark:text-gray-100">
                        Settings
                      </div>
                      <div className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                        Customize your experience
                      </div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
})
