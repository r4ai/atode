import type { Meta, StoryObj } from "@storybook/react"
import { Mail, Search, Settings } from "lucide-react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable"

const meta = {
  title: "UI/Resizable",
  component: ResizablePanelGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    direction: "horizontal",
  },
  render: (args) => (
    <ResizablePanelGroup className="max-w-md rounded-lg border" {...args}>
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const Vertical: Story = {
  args: {
    direction: "vertical",
  },
  render: (args) => (
    <ResizablePanelGroup
      className="min-h-[200px] max-w-md rounded-lg border"
      {...args}
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const WithHandle: Story = {
  args: {
    direction: "horizontal",
  },
  render: (args) => (
    <ResizablePanelGroup className="max-w-md rounded-lg border" {...args}>
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const ThreePanels: Story = {
  args: {
    direction: "horizontal",
  },
  render: (args) => (
    <ResizablePanelGroup
      className="min-h-[200px] max-w-lg rounded-lg border"
      {...args}
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Left</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Center</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Right</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const NestedPanels: Story = {
  args: {
    direction: "horizontal",
  },
  render: (args) => (
    <ResizablePanelGroup
      className="min-h-[200px] max-w-lg rounded-lg border"
      {...args}
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Left</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Top Right</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Bottom Right</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const EmailLayout: Story = {
  args: {
    direction: "horizontal",
  },
  render: (args) => (
    <ResizablePanelGroup
      className="min-h-[400px] max-w-4xl rounded-lg border"
      {...args}
    >
      <ResizablePanel defaultSize={20} minSize={15}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b p-4">
            <Mail className="h-4 w-4" />
            <span className="font-semibold">Mail</span>
          </div>
          <div className="flex-1 p-4">
            <div className="space-y-2">
              <div className="rounded bg-muted p-2">Inbox</div>
              <div className="rounded p-2">Sent</div>
              <div className="rounded p-2">Drafts</div>
              <div className="rounded p-2">Trash</div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} minSize={20}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b p-4">
            <Search className="h-4 w-4" />
            <span className="font-semibold">Messages</span>
          </div>
          <div className="flex-1 p-4">
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`email-${i + 1}`} className="rounded border p-3">
                  <div className="font-medium">Email {i + 1}</div>
                  <div className="text-muted-foreground text-sm">
                    Subject line preview...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b p-4">
            <Settings className="h-4 w-4" />
            <span className="font-semibold">Email Content</span>
          </div>
          <div className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Welcome to our service!</h3>
                <p className="text-muted-foreground text-sm">
                  From: support@example.com
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p>Hello there!</p>
                <p>
                  Thank you for signing up for our service. We're excited to
                  have you on board.
                </p>
                <p>
                  If you have any questions, please don't hesitate to reach out
                  to our support team.
                </p>
                <p>
                  Best regards,
                  <br />
                  The Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
