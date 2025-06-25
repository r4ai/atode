import type { Meta, StoryObj } from "@storybook/react"
import { Skeleton } from "./skeleton"

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <Skeleton className="h-4 w-[250px]" {...args} />,
}

export const Circle: Story = {
  render: (args) => <Skeleton className="h-12 w-12 rounded-full" {...args} />,
}

export const Card: Story = {
  render: (args) => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" {...args} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" {...args} />
        <Skeleton className="h-4 w-[200px]" {...args} />
      </div>
    </div>
  ),
}

export const Paragraph: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" {...args} />
      <Skeleton className="h-4 w-full" {...args} />
      <Skeleton className="h-4 w-3/4" {...args} />
    </div>
  ),
}

export const ArticleCard: Story = {
  render: (args) => (
    <div className="flex max-w-sm flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" {...args} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" {...args} />
        <Skeleton className="h-4 w-4/5" {...args} />
      </div>
    </div>
  ),
}
