import type { Meta, StoryObj } from "@storybook/react"
import { AlertCircle, Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive"],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Alert className="max-w-md" {...args}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
  render: (args) => (
    <Alert className="max-w-md" {...args}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
}

export const WithoutIcon: Story = {
  render: (args) => (
    <Alert className="max-w-md" {...args}>
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>This is an alert without an icon.</AlertDescription>
    </Alert>
  ),
}

export const TitleOnly: Story = {
  render: (args) => (
    <Alert className="max-w-md" {...args}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Quick update</AlertTitle>
    </Alert>
  ),
}
