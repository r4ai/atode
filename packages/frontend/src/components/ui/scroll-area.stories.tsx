import type { Meta, StoryObj } from "@storybook/react"
import { ScrollArea, ScrollBar } from "./scroll-area"
import { Separator } from "./separator"

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
)

export const Default: Story = {
  render: (args) => (
    <ScrollArea className="h-72 w-48 rounded-md border" {...args}>
      <div className="p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: (args) => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border" {...args}>
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <figure key={`photo-${i + 1}`} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <img
                src={`https://picsum.photos/300/400?random=${i}`}
                alt={`Landscape ${i + 1}`}
                className="aspect-[3/4] h-fit w-fit object-cover"
                width={300}
                height={400}
              />
            </div>
            <figcaption className="pt-2 text-muted-foreground text-xs">
              Photo by{" "}
              <span className="font-semibold text-foreground">
                Artist {i + 1}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

export const TextContent: Story = {
  render: (args) => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4" {...args}>
      <div className="space-y-4">
        <h3 className="font-semibold">Lorem Ipsum</h3>
        <p className="text-sm leading-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
        <p className="text-sm leading-6">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
          omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
          veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
        <p className="text-sm leading-6">
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
          sit amet, consectetur, adipisci velit, sed quia non numquam eius modi
          tempora incidunt ut labore et dolore magnam aliquam quaerat
          voluptatem.
        </p>
        <p className="text-sm leading-6">
          Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
          autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
          nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
          voluptas nulla pariatur?
        </p>
      </div>
    </ScrollArea>
  ),
}

export const CodeBlock: Story = {
  render: (args) => (
    <ScrollArea className="h-72 w-80 rounded-md border" {...args}>
      <div className="p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">Code Example</h4>
        <pre className="text-sm">
          <code>{`import React from 'react'
import { ScrollArea } from './scroll-area'

export function MyComponent() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Scrollable Content
        </h4>
        {/* Your content here */}
      </div>
    </ScrollArea>
  )
}

// More code examples...
const longFunction = () => {
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
  ]
  
  return data.map(item => (
    <div key={item.id}>
      {item.name}
    </div>
  ))
}`}</code>
        </pre>
      </div>
    </ScrollArea>
  ),
}

export const Both: Story = {
  render: (args) => (
    <ScrollArea className="h-72 w-80 rounded-md border" {...args}>
      <div className="min-w-[600px] p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">Wide Table</h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="border-r p-2 text-left">Column 1</th>
              <th className="border-r p-2 text-left">Column 2</th>
              <th className="border-r p-2 text-left">Column 3</th>
              <th className="border-r p-2 text-left">Column 4</th>
              <th className="border-r p-2 text-left">Column 5</th>
              <th className="p-2 text-left">Column 6</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 30 }).map((_, i) => (
              <tr key={`row-${i + 1}`} className="border-b">
                <td className="border-r p-2">Cell {i + 1}.1</td>
                <td className="border-r p-2">Cell {i + 1}.2</td>
                <td className="border-r p-2">Cell {i + 1}.3</td>
                <td className="border-r p-2">Cell {i + 1}.4</td>
                <td className="border-r p-2">Cell {i + 1}.5</td>
                <td className="p-2">Cell {i + 1}.6</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}
