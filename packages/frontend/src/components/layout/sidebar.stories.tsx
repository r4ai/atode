import type { Meta, StoryObj } from "@storybook/react"
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
  args: {},
  render: (args) => (
    <SidebarProvider>
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
}
