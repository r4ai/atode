import type { Meta, StoryObj } from "@storybook/react"
import { useId } from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const nameId = useId()
    const usernameId = useId()
    return (
      <Sheet {...args}>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={nameId} className="text-right">
                Name
              </Label>
              <Input id={nameId} value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={usernameId} className="text-right">
                Username
              </Label>
              <Input id={usernameId} value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  },
}

export const LeftSide: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button>Open Left</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            This sheet opens from the left side.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Navigation content goes here...</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const TopSide: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button>Open Top</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notification</SheetTitle>
          <SheetDescription>This sheet opens from the top.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Notification content goes here...</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const BottomSide: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <Button>Open Bottom</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Actions</SheetTitle>
          <SheetDescription>This sheet opens from the bottom.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Action content goes here...</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
}
