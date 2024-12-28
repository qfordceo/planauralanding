import { format, addDays, startOfWeek, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContractorDayException } from "@/types/contractor"

interface WeekViewProps {
  selectedDate: Date
  weeklyAvailability: any[] // Replace with proper type
  dayExceptions?: ContractorDayException[]
}

export function WeekView({ selectedDate, weeklyAvailability, dayExceptions }: WeekViewProps) {
  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekDays.map((date, index) => {
        const daySchedule = weeklyAvailability?.find(
          schedule => schedule.day_of_week === date.getDay()
        )
        const isExceptionDay = dayExceptions?.some(
          ex => ex.exception_date === format(date, "yyyy-MM-dd")
        )

        return (
          <Card key={index} className="h-full">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">
                {format(date, "EEE")}
                <span className="block text-xs text-muted-foreground">
                  {format(date, "MMM d")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {isExceptionDay ? (
                <div className="text-xs text-red-500">Unavailable</div>
              ) : daySchedule ? (
                <div className="text-xs">
                  {format(parseISO(`2000-01-01T${daySchedule.start_time}`), "h:mm a")} - 
                  {format(parseISO(`2000-01-01T${daySchedule.end_time}`), "h:mm a")}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">No availability</div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}