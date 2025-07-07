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
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onChange, placeholder, className, min, max, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          className={cn("pr-10", className)}
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