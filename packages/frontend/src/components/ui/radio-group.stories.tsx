import type { Meta, StoryObj } from "@storybook/react"
import { useId } from "react"
import { Label } from "./label"
import { RadioGroup, RadioGroupItem } from "./radio-group"

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const id1 = useId()
    const id2 = useId()
    const id3 = useId()

    return (
      <RadioGroup defaultValue="comfortable" {...args}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id={id1} />
          <Label htmlFor={id1}>Default</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="comfortable" id={id2} />
          <Label htmlFor={id2}>Comfortable</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="compact" id={id3} />
          <Label htmlFor={id3}>Compact</Label>
        </div>
      </RadioGroup>
    )
  },
}

export const WithDefaultValue: Story = {
  render: (args) => {
    const id1 = useId()
    const id2 = useId()

    return (
      <RadioGroup defaultValue="option-two" {...args}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id={id1} />
          <Label htmlFor={id1}>Option One</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id={id2} />
          <Label htmlFor={id2}>Option Two</Label>
        </div>
      </RadioGroup>
    )
  },
}

export const Disabled: Story = {
  render: (args) => {
    const id1 = useId()
    const id2 = useId()
    const id3 = useId()

    return (
      <RadioGroup defaultValue="comfortable" disabled {...args}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="default" id={id1} />
          <Label htmlFor={id1}>Default</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="comfortable" id={id2} />
          <Label htmlFor={id2}>Comfortable</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="compact" id={id3} />
          <Label htmlFor={id3}>Compact</Label>
        </div>
      </RadioGroup>
    )
  },
}
