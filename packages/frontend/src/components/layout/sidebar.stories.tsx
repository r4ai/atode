import type { Meta, StoryObj } from "@storybook/react"
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
import { expect, userEvent, within } from "storybook/test"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
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

// Create a Storybook-specific version of AppSidebar without router dependencies
const AppSidebarForStorybook = ({
  currentPath = "/home",
  ...props
}: React.ComponentProps<typeof SidebarPrimitive> & {
  currentPath?: string
}) => {
  return (
    <SidebarPrimitive collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <a href="/home">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <CheckSquare className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">atode</span>
                  <span className="truncate text-xs">Task Manager</span>
                </div>
              </a>
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
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
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
                      <a href={projectPath}>
                        <div
                          className={cn("h-2 w-2 rounded-full", project.color)}
                        />
                        <span>{project.name}</span>
                      </a>
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
                  <a href="/favorites">
                    <Star className="h-4 w-4" />
                    <span>Starred Tasks</span>
                  </a>
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
              <a href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  )
}

const meta = {
  title: "Layout/AppSidebar",
  component: AppSidebarForStorybook,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    currentPath: {
      control: { type: "select" },
      options: [
        "/home",
        "/inbox",
        "/today",
        "/completed",
        "/favorites",
        "/settings",
        "/project/1",
        "/project/2",
        "/project/3",
      ],
    },
    side: {
      control: { type: "select" },
      options: ["left", "right"],
    },
    variant: {
      control: { type: "select" },
      options: ["sidebar", "floating", "inset"],
    },
    collapsible: {
      control: { type: "select" },
      options: ["offcanvas", "icon", "none"],
    },
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <Story />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-px bg-sidebar-border" />
                <div className="font-semibold">atode</div>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof AppSidebarForStorybook>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentPath: "/home",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify sidebar is visible
    const sidebar = canvas.getByRole("complementary")
    await expect(sidebar).toBeVisible()

    // Verify navigation items are present
    const homeLink = canvas.getByRole("link", { name: /home/i })
    const inboxLink = canvas.getByRole("link", { name: /inbox/i })
    const todayLink = canvas.getByRole("link", { name: /today/i })
    const completedLink = canvas.getByRole("link", { name: /completed/i })

    await expect(homeLink).toBeVisible()
    await expect(inboxLink).toBeVisible()
    await expect(todayLink).toBeVisible()
    await expect(completedLink).toBeVisible()

    // Verify projects section
    const projectsSection = canvas.getByText("Projects")
    await expect(projectsSection).toBeVisible()

    // Verify project links
    const personalProject = canvas.getByRole("link", { name: /personal/i })
    const workProject = canvas.getByRole("link", { name: /work/i })
    const shoppingProject = canvas.getByRole("link", { name: /shopping/i })

    await expect(personalProject).toBeVisible()
    await expect(workProject).toBeVisible()
    await expect(shoppingProject).toBeVisible()

    // Verify project task counts are displayed
    const personalBadge = canvas.getByText("5")
    const workBadge = canvas.getByText("12")
    const shoppingBadge = canvas.getByText("3")

    await expect(personalBadge).toBeVisible()
    await expect(workBadge).toBeVisible()
    await expect(shoppingBadge).toBeVisible()

    // Verify add project button
    const addProjectButton = canvas.getByRole("button", {
      name: /add project/i,
    })
    await expect(addProjectButton).toBeVisible()

    // Verify favorites section
    const favoritesSection = canvas.getByText("Favorites")
    await expect(favoritesSection).toBeVisible()

    const starredTasksLink = canvas.getByRole("link", {
      name: /starred tasks/i,
    })
    await expect(starredTasksLink).toBeVisible()

    // Verify settings link in footer
    const settingsLink = canvas.getByRole("link", { name: /settings/i })
    await expect(settingsLink).toBeVisible()
  },
}

export const OnInboxPage: Story = {
  args: {
    currentPath: "/inbox",
  },
}

export const OnTodayPage: Story = {
  args: {
    currentPath: "/today",
  },
}

export const ProjectSelected: Story = {
  args: {
    currentPath: "/project/2",
  },
}

export const WithInteractions: Story = {
  args: {
    currentPath: "/home",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const user = userEvent.setup()

    // Test clicking on navigation items
    const inboxLink = canvas.getByRole("link", { name: /inbox/i })
    await user.click(inboxLink)
    await expect(inboxLink).toBeVisible()

    // Test clicking on a project
    const personalProject = canvas.getByRole("link", { name: /personal/i })
    await user.click(personalProject)
    await expect(personalProject).toBeVisible()

    // Test Add Project button interaction
    const addProjectButton = canvas.getByRole("button", {
      name: /add project/i,
    })
    await user.click(addProjectButton)
    await expect(addProjectButton).toBeVisible()

    // Test clicking favorites
    const starredTasksLink = canvas.getByRole("link", {
      name: /starred tasks/i,
    })
    await user.click(starredTasksLink)
    await expect(starredTasksLink).toBeVisible()

    // Test settings link
    const settingsLink = canvas.getByRole("link", { name: /settings/i })
    await user.click(settingsLink)
    await expect(settingsLink).toBeVisible()
  },
}

export const CollapsedStart: Story = {
  args: {
    currentPath: "/home",
    collapsible: "icon",
  },
  decorators: [
    (Story) => (
      <SidebarProvider defaultOpen={false}>
        <div className="flex h-screen w-full">
          <Story />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="h-4 w-px bg-sidebar-border" />
                <div className="font-semibold">atode (Collapsed)</div>
              </div>
            </header>
            <div className="p-4">
              <p className="text-muted-foreground">
                Click the sidebar toggle to expand the collapsed sidebar.
              </p>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    ),
  ],
}

export const Floating: Story = {
  args: {
    variant: "floating",
    currentPath: "/home",
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="flex h-screen w-full bg-muted/20">
          <Story />
          <SidebarInset>
            <div className="p-4">
              <h1 className="font-bold text-2xl">Floating Sidebar</h1>
              <p className="text-muted-foreground">
                This sidebar has a floating variant with a background.
              </p>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    ),
  ],
}
