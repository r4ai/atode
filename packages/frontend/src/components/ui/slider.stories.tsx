import type { Meta, StoryObj } from "@storybook/react"
import { useId } from "react"
import { Slider } from "./slider"

const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: { type: "object" },
    },
    min: {
      control: { type: "number" },
    },
    max: {
      control: { type: "number" },
    },
    step: {
      control: { type: "number" },
    },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-[300px] space-y-4">
      <Slider defaultValue={[50]} max={100} step={1} {...args} />
    </div>
  ),
}

export const Range: Story = {
  render: (args) => (
    <div className="w-[300px] space-y-4">
      <Slider defaultValue={[25, 75]} max={100} step={1} {...args} />
    </div>
  ),
}

export const WithLabels: Story = {
  render: (args) => {
    const sliderId = useId()
    return (
      <div className="w-[300px] space-y-4">
        <div className="space-y-2">
          <label htmlFor={sliderId} className="font-medium text-sm">
            Volume
          </label>
          <Slider
            id={sliderId}
            defaultValue={[33]}
            max={100}
            step={1}
            {...args}
          />
          <div className="flex justify-between text-muted-foreground text-xs">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="w-[300px] space-y-4">
      <Slider defaultValue={[50]} max={100} step={1} disabled {...args} />
    </div>
  ),
}
