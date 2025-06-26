import { createFileRoute } from "@tanstack/react-router"
import { TaskList } from "@/components/tasks/task-list"

const Home = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="mx-auto w-full max-w-4xl">
        <TaskList title="Today's Tasks" showCompleted={false} />
      </div>
    </main>
  )
}

export const Route = createFileRoute("/(app)/home/")({
  component: Home,
})
