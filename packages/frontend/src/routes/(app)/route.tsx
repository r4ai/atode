import { getSession } from "@hono/auth-js/react"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { AppHeader } from "@/components/layout/header"
import { AppSidebar } from "@/components/layout/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

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
  component: () => {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    )
  },
})
