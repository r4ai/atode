import { createFileRoute } from "@tanstack/react-router"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserMenu } from "@/components/auth/user-menu"
import { AppSidebar } from "@/components/layout/sidebar"
import { TaskList } from "@/components/tasks/task-list"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const InboxPage = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="font-semibold text-xl">Inbox</h1>
            </div>
            <div className="ml-auto px-4">
              <UserMenu />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="mx-auto w-full max-w-4xl">
              <TaskList title="All Tasks" />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

export const Route = createFileRoute("/inbox")({
  component: InboxPage,
})
