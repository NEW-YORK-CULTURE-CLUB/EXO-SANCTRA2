"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 rounded-lg shadow-sm", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-6",
        caption: "flex justify-between items-center pt-1 px-2 relative",
        caption_label: "text-base items-center justify-center text-center ",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          " p-0 hover:bg-gray-100 rounded-full transition-colors"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex w-full gap-0.5",
        head_cell: "p-3 flex items-center justify-center text-xs text-gray-500",
        row: "flex w-full mt-0.5 gap-0.5",
        cell: "relative p-3 flex items-center justify-center text-xs p-0 hover:bg-gray-100 rounded-full transition-colors",
        day: cn(
          " p-3 font-normal items-center justify-center rounded-full hover:bg-gray-100",
          "aria-selected:bg-primary aria-selected:text-primary-foreground"
        ),
        day_today: "bg-gray-50 text-primary",
        day_outside: "text-gray-400",
        day_disabled: "text-gray-300",
        day_hidden: "invisible",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
        day_range_middle: "rounded-none bg-gray-100",
        day_range_end: "rounded-r-full",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
