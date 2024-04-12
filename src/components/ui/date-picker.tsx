"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DayPickerSingleProps } from "react-day-picker";
import { forwardRef } from "react";

export type DatePickerProps = {
  value?: Date;
  onChange?: (value?: Date) => void;
  calendarProps?: Omit<DayPickerSingleProps, "selected" | "onSelect">;
};

export const DatePicker = forwardRef<React.ElementRef<typeof Button>, DatePickerProps>((props, ref) => {
  const { value, onChange, calendarProps } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button ref={ref} variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !value && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar {...calendarProps} mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
});

DatePicker.displayName = "DatePicker";
export default DatePicker;
