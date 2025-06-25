import type { Meta, StoryObj } from "@storybook/react"
import { useId } from "react"
import { Label } from "./label"

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Label",
  },
}

export const WithHtmlFor: Story = {
  args: {
    htmlFor: "input-id",
    children: "Email Address",
  },
  render: (args) => {
    const inputId = useId()
    return (
      <div className="space-y-2">
        <Label htmlFor={inputId} {...args} />
        <input
          id={inputId}
          type="email"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          placeholder="Enter your email"
        />
      </div>
    )
  },
}

export const Required: Story = {
  args: {
    children: (
      <>
        Required Field
        <span className="ml-1 text-destructive">*</span>
      </>
    ),
  },
}
