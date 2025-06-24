import { Link, useRouterState } from "@tanstack/react-router"
import {
  Calendar,
  CheckSquare,
  Home,
  Inbox,
  Plus,
  Settings,
  Star,
} from "lucide-react"
import type * as React from "react"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Today", href: "/today", icon: Calendar },
  { name: "Completed", href: "/completed", icon: CheckSquare },
]

const projects = [
  { id: "1", name: "Personal", color: "bg-blue-500", taskCount: 5 },
  { id: "2", name: "Work", color: "bg-green-500", taskCount: 12 },
  { id: "3", name: "Shopping", color: "bg-purple-500", taskCount: 3 },
]

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof SidebarPrimitive>) => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <SidebarPrimitive collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to="/home">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <CheckSquare className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TODO</span>
                  <span className="truncate text-xs">Task Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Projects Section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Projects</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => {
                const projectPath = `/project/${project.id}`
                const isActive = currentPath === projectPath
                return (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={projectPath}>
                        <div
                          className={cn("h-2 w-2 rounded-full", project.color)}
                        />
                        <span>{project.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{project.taskCount}</SidebarMenuBadge>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Plus className="h-4 w-4" />
                  <span>Add Project</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Favorites */}
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === "/favorites"}
                >
                  <Link to="/favorites">
                    <Star className="h-4 w-4" />
                    <span>Starred Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={currentPath === "/settings"}>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  )
}
