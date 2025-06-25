import type { Meta, StoryObj } from "@storybook/react"
import { Progress } from "./progress"

const meta = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 33,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Progress {...args} />
    </div>
  ),
}

export const Empty: Story = {
  args: {
    value: 0,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Progress {...args} />
    </div>
  ),
}

export const Half: Story = {
  args: {
    value: 50,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Progress {...args} />
    </div>
  ),
}

export const Complete: Story = {
  args: {
    value: 100,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Progress {...args} />
    </div>
  ),
}

export const WithLabel: Story = {
  args: {
    value: 75,
  },
  render: (args) => (
    <div className="w-[400px] space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{args.value}%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
}
