import type { Meta, StoryObj } from "@storybook/react"
import { Separator } from "./separator"

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
    decorative: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64 space-y-4">
      <div>
        <h4 className="font-medium text-sm leading-none">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library.
        </p>
      </div>
      <Separator {...args} />
      <div className="space-y-1">
        <h4 className="font-medium text-sm leading-none">Installation</h4>
        <p className="text-muted-foreground text-sm">
          Get started with the installation guide.
        </p>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator {...args} />
      <div>Docs</div>
      <Separator {...args} />
      <div>Source</div>
    </div>
  ),
}

export const InText: Story = {
  render: (args) => (
    <div className="max-w-md">
      <div className="space-y-1">
        <h4 className="font-medium text-sm leading-none">Account Settings</h4>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator className="my-4" {...args} />
      <div className="space-y-1">
        <h4 className="font-medium text-sm leading-none">Privacy Settings</h4>
        <p className="text-muted-foreground text-sm">
          Control your privacy and data sharing preferences.
        </p>
      </div>
    </div>
  ),
}
