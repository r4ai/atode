import type { Meta, StoryObj } from "@storybook/react"
import { AspectRatio } from "./aspect-ratio"

const meta = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    ratio: {
      control: { type: "number" },
    },
  },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Drew Beamer landscape"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  args: {
    ratio: 1 / 1,
  },
  render: (args) => (
    <div className="w-[300px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&dpr=2&q=80"
          alt="Avatar"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const Portrait: Story = {
  args: {
    ratio: 3 / 4,
  },
  render: (args) => (
    <div className="w-[300px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=533&dpr=2&q=80"
          alt="Portrait"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const UltraWide: Story = {
  args: {
    ratio: 21 / 9,
  },
  render: (args) => (
    <div className="w-[600px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&dpr=2&q=80"
          alt="Landscape"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const WithContent: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio {...args} className="bg-muted">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h3 className="font-semibold text-lg">Video Placeholder</h3>
            <p className="text-muted-foreground text-sm">16:9 Aspect Ratio</p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Instagram: Story = {
  args: {
    ratio: 1080 / 1350, // Instagram post ratio
  },
  render: (args) => (
    <div className="w-[270px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=500&dpr=2&q=80"
          alt="Instagram post"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const TwitterCard: Story = {
  args: {
    ratio: 2 / 1,
  },
  render: (args) => (
    <div className="w-[400px]">
      <AspectRatio
        {...args}
        className="bg-gradient-to-r from-blue-500 to-purple-600"
      >
        <div className="flex h-full items-center justify-center text-white">
          <div className="text-center">
            <h3 className="font-bold text-xl">Twitter Card</h3>
            <p className="text-sm opacity-90">2:1 Aspect Ratio</p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
}
