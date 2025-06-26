import { getSession } from "@hono/auth-js/react"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  loader: async () => {
    const session = await getSession()
    if (!session?.user) {
      redirect({
        to: "/login",
        throw: true,
      })
    }

    // TODO: Implement a landing page for external users
    redirect({
      to: "/home",
      throw: true,
    })
  },
})
