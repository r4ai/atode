import type { Meta, StoryObj } from "@storybook/react"
import { Card, CardContent } from "./card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel"

const meta = {
  title: "UI/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Carousel className="w-full max-w-xs" {...args}>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={`default-${index + 1}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="font-semibold text-4xl">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const MultipleItems: Story = {
  render: (args) => (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-sm"
      {...args}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={`multiple-${index + 1}`}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="font-semibold text-2xl">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const Vertical: Story = {
  render: (args) => (
    <Carousel orientation="vertical" className="w-full max-w-xs" {...args}>
      <CarouselContent className="-mt-1 h-[200px]">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={`vertical-${index + 1}`}
            className="pt-1 md:basis-1/2"
          >
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="font-semibold text-3xl">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const WithContent: Story = {
  render: (args) => (
    <Carousel className="w-full max-w-lg" {...args}>
      <CarouselContent>
        <CarouselItem>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-400 to-blue-600">
                  <span className="font-bold text-white text-xl">Slide 1</span>
                </div>
                <h3 className="font-semibold text-lg">Beautiful Landscapes</h3>
                <p className="text-muted-foreground text-sm">
                  Discover amazing landscapes from around the world with
                  stunning photography.
                </p>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gradient-to-r from-green-400 to-green-600">
                  <span className="font-bold text-white text-xl">Slide 2</span>
                </div>
                <h3 className="font-semibold text-lg">Urban Architecture</h3>
                <p className="text-muted-foreground text-sm">
                  Explore modern and classical architecture in cities worldwide.
                </p>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-400 to-purple-600">
                  <span className="font-bold text-white text-xl">Slide 3</span>
                </div>
                <h3 className="font-semibold text-lg">Abstract Art</h3>
                <p className="text-muted-foreground text-sm">
                  Experience creative and thought-provoking abstract artwork.
                </p>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const AutoPlay: Story = {
  render: (args) => (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-xs"
      {...args}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={`autoplay-${index + 1}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="font-semibold text-4xl">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const Gallery: Story = {
  render: (args) => {
    const images = [
      {
        src: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
        alt: "Drew Beamer landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&dpr=2&q=80",
        alt: "Mountain landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&dpr=2&q=80",
        alt: "Nature landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&dpr=2&q=80",
        alt: "Wildlife landscape",
      },
    ]

    return (
      <Carousel className="w-full max-w-2xl" {...args}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={`gallery-${index + 1}`}>
              <div className="p-1">
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-64 w-full rounded-lg object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  },
}
