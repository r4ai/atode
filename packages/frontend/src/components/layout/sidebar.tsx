import { Link, useLocation, useRouterState } from "@tanstack/react-router"
import {
  Calendar,
  CheckSquare,
  Home,
  Inbox,
  Plus,
  Settings,
  Star,
} from "lucide-react"
import { Suspense } from "react"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  Sidebar as SidebarPrimitive,
} from "@/components/ui/sidebar"
import { api } from "@/lib/api"

const navigationItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Today", href: "/today", icon: Calendar },
  { name: "Completed", href: "/completed", icon: CheckSquare },
]

const NavigationGroup = () => {
  const pathname = useLocation({ select: (location) => location.pathname })

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
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
  )
}

const ProjectsGroup = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span>Projects</span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <Suspense
          fallback={
            <>
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
            </>
          }
        >
          <ProjectsGroupMenu />
        </Suspense>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

const ProjectsGroupMenu = () => {
  const pathname = useLocation({ select: (location) => location.pathname })
  const projects = api.useSuspenseQuery("get", "/api/projects")

  return (
    <SidebarMenu>
      {projects.data.data.map((project) => {
        const projectPath = `/project/${project.id}`
        const isActive = pathname === projectPath
        return (
          <SidebarMenuItem key={project.id}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link to={projectPath}>
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: project.color ?? "#6b7280",
                  }}
                />
                <span>{project.name}</span>
              </Link>
            </SidebarMenuButton>
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
  )
}

const FavoritesGroup = () => {
  const pathname = useLocation({ select: (location) => location.pathname })

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/favorites"}>
              <Link to="/favorites">
                <Star className="h-4 w-4" />
                <span>Starred Tasks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

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
                  <span className="truncate font-semibold">atode</span>
                  <span className="truncate text-xs">Task Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavigationGroup />
        <ProjectsGroup />
        <FavoritesGroup />
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
