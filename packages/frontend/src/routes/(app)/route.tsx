import { getSession } from "@hono/auth-js/react"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    if (!session?.user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      })
    }
  },
})
