import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "@storybook/test"
import type { paths } from "backend/openapi"
import { HttpResponse, http } from "msw"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import { AppHeader } from "./header"
import { AppSidebar } from "./sidebar"

const meta = {
  title: "Layout/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppSidebar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "sidebar",
  },
  render: (args) => (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar {...args} />
      <SidebarInset>
        <AppHeader />
        <main className="m-5 mx-auto my-12 max-w-lg">
          <h1 className="font-bold text-2xl">Main Content Area</h1>
          <p>
            This is the main content area where your application content will be
            displayed.
          </p>
          <p>
            Use this space to showcase your app's features and functionality.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check if sidebar toggle button exists
    const toggleButton = canvas.getByRole("button", { name: /toggle sidebar/i })
    await expect(toggleButton).toBeInTheDocument()

    // Click the toggle button to open sidebar
    await userEvent.click(toggleButton)

    // Wait a bit for the sidebar to open
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Check that sidebar content is visible
    // Try to find navigation items - they should be visible after clicking toggle
    let homeLink: HTMLElement
    try {
      homeLink = await canvas.findByRole(
        "link",
        { name: /^home$/i },
        { timeout: 2000 },
      )
    } catch {
      // If not found as link, it might be in the sidebar dialog
      homeLink = canvas.getByText("Home")
    }
    await expect(homeLink).toBeInTheDocument()

    // Check other navigation items exist
    const inboxElement = canvas.getByText("Inbox")
    await expect(inboxElement).toBeInTheDocument()

    const todayElement = canvas.getByText("Today")
    await expect(todayElement).toBeInTheDocument()

    const completedElement = canvas.getByText("Completed")
    await expect(completedElement).toBeInTheDocument()

    // Check Projects section
    const projectsHeading = canvas.getByText("Projects")
    await expect(projectsHeading).toBeInTheDocument()

    // Wait for the suspense to resolve and find the Add Project button
    const addProjectButton = await canvas.findByRole(
      "button",
      {
        name: /add project/i,
      },
      { timeout: 3000 },
    )
    await expect(addProjectButton).toBeInTheDocument()

    // Check Favorites section
    const favoritesHeading = canvas.getByText("Favorites")
    await expect(favoritesHeading).toBeInTheDocument()

    const starredTasksElement = canvas.getByText("Starred Tasks")
    await expect(starredTasksElement).toBeInTheDocument()

    // Check Settings link in footer
    const settingsElement = canvas.getByText("Settings")
    await expect(settingsElement).toBeInTheDocument()

    // Check app header with logo text
    const appLogo = canvas.getByText("atode")
    await expect(appLogo).toBeInTheDocument()

    const taskManagerText = canvas.getByText("Task Manager")
    await expect(taskManagerText).toBeInTheDocument()
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/projects", () =>
          HttpResponse.json<
            paths["/api/projects"]["get"]["responses"]["200"]["content"]["application/json"]
          >(
            {
              success: true,
              data: [
                {
                  id: 1,
                  name: "Shopping List",
                  description: "Items to buy for the week",
                  userId: 1,
                  depth: 1,
                  color: "#FF5733",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                {
                  id: 2,
                  name: "Work Projects",
                  description: "Ongoing work-related projects",
                  userId: 1,
                  depth: 1,
                  color: "#33FF57",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                {
                  id: 3,
                  name: "Personal Goals",
                  description: "Goals for personal development",
                  userId: 1,
                  depth: 1,
                  color: "#3357FF",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            },
            { status: 200 },
          ),
        ),
      ],
    },
  },
}
