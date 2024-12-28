import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import type { ContractorDayException } from "@/types/contractor"

interface AvailabilityCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  dayExceptions?: ContractorDayException[]
}

export function AvailabilityCalendar({ 
  selectedDate, 
  onDateSelect, 
  dayExceptions 
}: AvailabilityCalendarProps) {
  return (
    <div className="rounded-lg border">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (date) {
            onDateSelect(date)
          }
        }}
        modifiers={{
          unavailable: (date) => {
            const formattedDate = format(date, "yyyy-MM-dd")
            return dayExceptions?.some(
              ex => ex.exception_date === formattedDate
            ) || false
          }
        }}
        modifiersStyles={{
          unavailable: { 
            textDecoration: "line-through",
            color: "red" 
          }
        }}
        className="rounded-md border"
      />
    </div>
  )
}