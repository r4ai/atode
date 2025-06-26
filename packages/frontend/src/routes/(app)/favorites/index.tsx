import { createFileRoute } from "@tanstack/react-router"

const Favorites = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <h1 className="font-bold text-2xl">Favorites Page</h1>
    </div>
  )
}

export const Route = createFileRoute("/(app)/favorites/")({
  component: Favorites,
})
