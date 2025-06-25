import { zodResolver } from "@hookform/resolvers/zod"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "./button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form"
import { Input } from "./input"
import { Textarea } from "./textarea"

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please enter an email address.",
    })
    .email(),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const meta = {
  title: "UI/Form",
  component: Form,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: () => {
    const form = useForm<ProfileFormValues>({
      resolver: zodResolver(profileFormSchema),
      defaultValues: {
        username: "",
        email: "",
        bio: "",
      },
    })

    const onSubmit = (data: ProfileFormValues) => {
      console.log(data)
    }

    return (
      <div className="w-[400px] space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="hello@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll use this email to contact you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can @mention other users and organizations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update profile</Button>
          </form>
        </Form>
      </div>
    )
  },
}

export const WithValidationErrors: Story = {
  render: () => {
    const form = useForm<ProfileFormValues>({
      resolver: zodResolver(profileFormSchema),
      defaultValues: {
        username: "a",
        email: "invalid-email",
        bio: "This bio is way too long and exceeds the maximum character limit that we have set for user bios which should not be longer than 160 characters total",
      },
    })

    const [submitted, setSubmitted] = useState(false)

    const onSubmit = (data: ProfileFormValues) => {
      console.log(data)
      setSubmitted(true)
    }

    if (!submitted) {
      // Trigger validation on mount
      form.trigger()
    }

    return (
      <div className="w-[400px] space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="hello@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll use this email to contact you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can @mention other users and organizations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update profile</Button>
          </form>
        </Form>
      </div>
    )
  },
}

export const SimpleForm: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        name: "",
      },
    })

    return (
      <div className="w-[300px] space-y-6">
        <Form {...form}>
          <form className="space-y-4">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" />
              </FormControl>
              <FormDescription>
                This will be displayed on your profile.
              </FormDescription>
            </FormItem>
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </div>
    )
  },
}
