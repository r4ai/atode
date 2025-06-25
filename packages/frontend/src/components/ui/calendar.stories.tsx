import type { Meta, StoryObj } from "@storybook/react"
import { addDays, format } from "date-fns"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "./calendar"

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<any>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    )
  },
}

export const MultipleSelection: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([])

    return (
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        className="rounded-md border"
      />
    )
  },
}

export const RangeSelection: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: addDays(new Date(), 7),
    })

    return (
      <Calendar
        mode="range"
        defaultMonth={range?.from}
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        className="rounded-md border"
      />
    )
  },
}

export const WithDropdowns: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        fromYear={2020}
        toYear={2030}
        className="rounded-md border"
      />
    )
  },
}

export const DisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()

    const disabledDays = [
      { from: new Date(), to: addDays(new Date(), 3) },
      new Date(2024, 10, 15),
      new Date(2024, 10, 20),
    ]

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={disabledDays}
        className="rounded-md border"
      />
    )
  },
}

export const WeekStartMonday: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        weekStartsOn={1}
        className="rounded-md border"
      />
    )
  },
}

export const MultipleMonths: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        numberOfMonths={3}
        className="rounded-md border"
      />
    )
  },
}

export const WithFooter: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <div className="text-center text-muted-foreground text-sm">
          {date ? format(date, "PPP") : "Pick a date"}
        </div>
      </div>
    )
  },
}
