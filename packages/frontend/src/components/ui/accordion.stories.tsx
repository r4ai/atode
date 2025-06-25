import type { Meta, StoryObj } from "@storybook/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["single", "multiple"],
    },
    collapsible: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <Accordion className="w-full max-w-md" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you
          prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  args: {
    type: "multiple",
  },
  render: (args) => (
    <Accordion className="w-full max-w-md" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Features</AccordionTrigger>
        <AccordionContent>
          This accordion supports multiple open items simultaneously.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Accessibility</AccordionTrigger>
        <AccordionContent>
          Built with accessibility in mind using Radix UI primitives.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Customization</AccordionTrigger>
        <AccordionContent>
          Easily customizable with Tailwind CSS classes.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const WithDefaultValue: Story = {
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-1",
  },
  render: (args) => (
    <Accordion className="w-full max-w-md" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>This item is open by default</AccordionTrigger>
        <AccordionContent>
          This content is visible when the component first loads.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second item</AccordionTrigger>
        <AccordionContent>
          This content is initially collapsed.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
