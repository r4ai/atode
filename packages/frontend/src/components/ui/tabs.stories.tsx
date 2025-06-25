import type { Meta, StoryObj } from "@storybook/react"
import { useId } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card"
import { Input } from "./input"
import { Label } from "./label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const nameId = useId()
    const usernameId = useId()
    const currentId = useId()
    const newId = useId()
    return (
      <Tabs defaultValue="account" className="w-[400px]" {...args}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor={nameId}>Name</Label>
                <Input id={nameId} defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor={usernameId}>Username</Label>
                <Input id={usernameId} defaultValue="@peduarte" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor={currentId}>Current password</Label>
                <Input id={currentId} type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor={newId}>New password</Label>
                <Input id={newId} type="password" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    )
  },
}

export const Simple: Story = {
  render: (args) => (
    <Tabs defaultValue="tab1" className="w-[400px]" {...args}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p>Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p>Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p>Content for Tab 3</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <Tabs defaultValue="overview" className="w-[400px]" {...args}>
      <TabsList>
        <TabsTrigger value="overview">📊 Overview</TabsTrigger>
        <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
        <TabsTrigger value="reports">📋 Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg">Overview Dashboard</h3>
          <p className="text-muted-foreground">View your overall statistics</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg">Analytics</h3>
          <p className="text-muted-foreground">
            Detailed analytics and insights
          </p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg">Reports</h3>
          <p className="text-muted-foreground">Generate and view reports</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
}
