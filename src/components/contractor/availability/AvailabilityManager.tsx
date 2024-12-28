import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WeeklyScheduleEditor } from "./WeeklyScheduleEditor"
import { ViewSelector } from "./ViewSelector"
import { AvailabilityCalendar } from "./AvailabilityCalendar"
import { useAvailabilityData } from "./hooks/useAvailabilityData"
import { useAvailabilityMutations } from "./hooks/useAvailabilityMutations"
import { DayView } from "./DayView"
import { WeekView } from "./WeekView"

type ViewMode = "month" | "week" | "day"

export function AvailabilityManager({ contractorId }: { contractorId: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  
  const { weeklyAvailability, dayExceptions, isLoading } = useAvailabilityData(contractorId)
  const { updateAvailabilityMutation, updateDayExceptionMutation } = useAvailabilityMutations(contractorId)

  const handleDayClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    const existingException = dayExceptions?.find(
      ex => ex.exception_date === formattedDate
    )
    updateDayExceptionMutation.mutate({
      date: formattedDate,
      isAvailable: !!existingException,
    })
  }

  if (isLoading) {
    return <div>Loading availability...</div>
  }

  const renderView = () => {
    switch (viewMode) {
      case "day":
        return (
          <DayView 
            selectedDate={selectedDate}
            weeklyAvailability={weeklyAvailability}
            dayExceptions={dayExceptions}
          />
        )
      case "week":
        return (
          <WeekView 
            selectedDate={selectedDate}
            weeklyAvailability={weeklyAvailability}
            dayExceptions={dayExceptions}
          />
        )
      default:
        return (
          <AvailabilityCalendar
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date)
              handleDayClick(date)
            }}
            dayExceptions={dayExceptions}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ViewSelector
          currentView={viewMode}
          onViewChange={setViewMode}
        />
        <Button
          variant="outline"
          onClick={() => setIsEditingSchedule(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Set Weekly Schedule
        </Button>
      </div>

      {renderView()}

      <div className="text-sm text-muted-foreground">
        Click on a date to mark it as unavailable/available
      </div>

      {isEditingSchedule && (
        <WeeklyScheduleEditor
          availability={weeklyAvailability}
          onSave={async (scheduleData) => {
            await updateAvailabilityMutation.mutateAsync(scheduleData)
            setIsEditingSchedule(false)
          }}
          onCancel={() => setIsEditingSchedule(false)}
        />
      )}
    </div>
  )
}