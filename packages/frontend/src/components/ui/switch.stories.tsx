import type { Meta, StoryObj } from "@storybook/react"
import { useId } from "react"
import { Label } from "./label"
import { Switch } from "./switch"

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
}

export const WithLabel: Story = {
  render: (args) => {
    const id = useId()
    return (
      <div className="flex items-center space-x-2">
        <Switch id={id} {...args} />
        <Label htmlFor={id}>Airplane Mode</Label>
      </div>
    )
  },
}

export const WithLabelAndDescription: Story = {
  render: (args) => {
    const id = useId()
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id={id} {...args} />
          <Label htmlFor={id}>Marketing emails</Label>
        </div>
        <p className="text-muted-foreground text-sm">
          Receive emails about new products, features, and more.
        </p>
      </div>
    )
  },
}
