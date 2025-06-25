import type { Meta, StoryObj } from "@storybook/react"
import { useId } from "react"
import { Textarea } from "./textarea"

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Type your message here.",
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: "This is a sample text in the textarea component.",
    placeholder: "Type your message here.",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "This textarea is disabled.",
  },
}

export const WithRows: Story = {
  args: {
    rows: 4,
    placeholder: "This textarea has 4 rows.",
  },
}

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    placeholder: "This textarea has invalid state.",
  },
}

export const WithLabel: Story = {
  render: (args) => {
    const messageId = useId()
    return (
      <div className="grid w-full gap-1.5">
        <label htmlFor={messageId} className="font-medium text-sm leading-none">
          Your message
        </label>
        <Textarea
          id={messageId}
          placeholder="Type your message here."
          {...args}
        />
      </div>
    )
  },
}
