import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContractorDayException } from "@/types/contractor"

interface DayViewProps {
  selectedDate: Date
  weeklyAvailability: any[] // Replace with proper type
  dayExceptions?: ContractorDayException[]
}

export function DayView({ selectedDate, weeklyAvailability, dayExceptions }: DayViewProps) {
  const dayOfWeek = selectedDate.getDay()
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy")
  
  const daySchedule = weeklyAvailability?.find(
    schedule => schedule.day_of_week === dayOfWeek
  )

  const isExceptionDay = dayExceptions?.some(
    ex => ex.exception_date === format(selectedDate, "yyyy-MM-dd")
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formattedDate}</CardTitle>
      </CardHeader>
      <CardContent>
        {isExceptionDay ? (
          <div className="text-red-500">Marked as unavailable</div>
        ) : daySchedule ? (
          <div className="space-y-2">
            <div>Available Hours:</div>
            <div className="text-lg">
              {format(parseISO(`2000-01-01T${daySchedule.start_time}`), "h:mm a")} - 
              {format(parseISO(`2000-01-01T${daySchedule.end_time}`), "h:mm a")}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">No availability set for this day</div>
        )}
      </CardContent>
    </Card>
  )
}