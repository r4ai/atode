import type { Meta, StoryObj } from "@storybook/react"
import { toast } from "sonner"
import { Button } from "./button"
import { Toaster } from "./sonner"

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
            })
          }
        >
          Show Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.success("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
            })
          }
        >
          Success Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error("Event creation failed", {
              description: "There was an error creating your event",
            })
          }
        >
          Error Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.info("New feature available", {
              description: "Check out the new dashboard layout",
            })
          }
        >
          Info Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning("Storage almost full", {
              description: "You have used 90% of your storage space",
            })
          }
        >
          Warning Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.loading("Creating event...", {
              description: "Please wait while we create your event",
            })
          }
        >
          Loading Toast
        </Button>
      </div>
    </div>
  ),
}

export const WithActions: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          Toast with Action
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.success("File uploaded successfully", {
              description: "Your file has been uploaded to the cloud",
              action: {
                label: "View",
                onClick: () => console.log("View file"),
              },
            })
          }
        >
          Success with Action
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error("Upload failed", {
              description: "Failed to upload your file",
              action: {
                label: "Retry",
                onClick: () => console.log("Retry upload"),
              },
            })
          }
        >
          Error with Action
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Friend request sent", {
              description: "Your friend request has been sent to John Doe",
              action: {
                label: "Cancel",
                onClick: () => console.log("Cancel request"),
              },
            })
          }
        >
          Cancel Action
        </Button>
      </div>
    </div>
  ),
}

export const CustomDuration: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() =>
            toast("Quick message", {
              description: "This will disappear in 1 second",
              duration: 1000,
            })
          }
        >
          1 Second Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Normal message", {
              description: "This will disappear in 4 seconds",
              duration: 4000,
            })
          }
        >
          4 Second Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Long message", {
              description: "This will stay for 10 seconds",
              duration: 10000,
            })
          }
        >
          10 Second Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Persistent message", {
              description: "This will stay until dismissed",
              duration: Number.POSITIVE_INFINITY,
            })
          }
        >
          Persistent Toast
        </Button>
      </div>
    </div>
  ),
}

export const PromiseToast: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => {
            const myPromise = new globalThis.Promise(
              (resolve: (value: { name: string }) => void) =>
                setTimeout(() => resolve({ name: "John Doe" }), 2000),
            )

            toast.promise(myPromise, {
              loading: "Loading...",
              success: (data: { name: string }) => {
                return `${data.name} has been added`
              },
              error: "Error",
            })
          }}
        >
          Promise Success
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const myPromise = new globalThis.Promise(
              (_: unknown, reject: (reason: Error) => void) =>
                setTimeout(
                  () => reject(new Error("Something went wrong")),
                  2000,
                ),
            )

            toast.promise(myPromise, {
              loading: "Loading...",
              success: "Success!",
              error: (err: Error) => err.message,
            })
          }}
        >
          Promise Error
        </Button>
      </div>
    </div>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster position="top-right" />
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          onClick={() =>
            toast("Top Left", { description: "Position: top-left" })
          }
        >
          Default Position
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            // Temporarily change position
            toast("Bottom Center", {
              description: "Position: bottom-center",
            })
          }}
        >
          Show Toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Success message")}
        >
          Success Toast
        </Button>
      </div>
      <p className="text-center text-muted-foreground text-sm">
        This example shows toasts in the default position (top-right). In a real
        app, you would configure the position via the Toaster component props.
      </p>
    </div>
  ),
}

export const Dismiss: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => {
            const id = toast("Dismissible toast", {
              description: "This toast can be dismissed programmatically",
              duration: Number.POSITIVE_INFINITY,
            })

            setTimeout(() => {
              toast.dismiss(id)
            }, 3000)
          }}
        >
          Auto Dismiss (3s)
        </Button>
        <Button variant="outline" onClick={() => toast.dismiss()}>
          Dismiss All
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            Array.from({ length: 5 }, (_, i) =>
              toast(`Toast ${i + 1}`, {
                description: `This is toast number ${i + 1}`,
              }),
            )
          }}
        >
          Create Multiple
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Rich content", {
              description: "This toast has rich content with custom styling",
              className: "border-blue-500 bg-blue-50 text-blue-900",
            })
          }
        >
          Rich Content
        </Button>
      </div>
    </div>
  ),
}
