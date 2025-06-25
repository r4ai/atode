import type { Meta, StoryObj } from "@storybook/react"
import { Bold, Italic, Underline } from "lucide-react"
import { Toggle } from "./toggle"

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "outline"],
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg"],
    },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Toggle",
  },
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Toggle",
  },
}

export const WithIcon: Story = {
  args: {
    "aria-label": "Toggle bold",
    children: <Bold className="h-4 w-4" />,
  },
}

export const WithText: Story = {
  args: {
    children: (
      <>
        <Bold className="h-4 w-4" />
        Bold
      </>
    ),
  },
}

export const Small: Story = {
  args: {
    size: "sm",
    "aria-label": "Toggle italic",
    children: <Italic className="h-4 w-4" />,
  },
}

export const Large: Story = {
  args: {
    size: "lg",
    "aria-label": "Toggle underline",
    children: <Underline className="h-4 w-4" />,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    "aria-label": "Toggle bold",
    children: <Bold className="h-4 w-4" />,
  },
}
