import * as React from "react"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  min?: string
  max?: string
  disabledDates?: string[]
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onChange, placeholder, className, min, max, disabledDates = [], ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedDate = e.target.value;
      // Only allow selection of enabled dates
      if (!disabledDates.includes(selectedDate)) {
        onChange?.(selectedDate);
      }
    };

    // Function to check if a date should be disabled
    const isDateDisabled = (date: string) => {
      return disabledDates.includes(date);
    };

    // Handle keydown to prevent manual entry of disabled dates
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const input = e.target as HTMLInputElement;
        if (input.value && isDateDisabled(input.value)) {
          input.value = value || '';
        }
      }
    };

    // Handle blur to validate the input
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value && isDateDisabled(e.target.value)) {
        e.target.value = value || '';
      }
    };

    return (
      <div className="relative">
        <Input
          type="date"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          className={cn("pr-10", className, {
            'opacity-50 cursor-not-allowed': value && isDateDisabled(value),
          })}
          ref={ref}
          {...props}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    )
  }
)

DatePicker.displayName = "DatePicker"

export { DatePicker }