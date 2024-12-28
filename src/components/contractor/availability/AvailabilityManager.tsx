import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { supabase } from "@/integrations/supabase/client"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { WeeklyScheduleEditor } from "./WeeklyScheduleEditor"
import { ViewSelector } from "./ViewSelector"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

type ViewMode = "month" | "week" | "day"

interface DayAvailability {
  date: string
  isAvailable: boolean
}

export function AvailabilityManager({ contractorId }: { contractorId: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  
  const queryClient = useQueryClient()

  const { data: weeklyAvailability, isLoading: isLoadingWeekly } = useQuery({
    queryKey: ["contractor-weekly-availability", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_availability")
        .select("*")
        .eq("contractor_id", contractorId)
      
      if (error) throw error
      return data
    },
  })

  const { data: dayExceptions, isLoading: isLoadingExceptions } = useQuery({
    queryKey: ["contractor-day-exceptions", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_day_exceptions")
        .select("*")
        .eq("contractor_id", contractorId)
      
      if (error) throw error
      return data || []
    },
  })

  const updateAvailabilityMutation = useMutation({
    mutationFn: async (scheduleData: {
      contractorId: string
      dayOfWeek: number
      startTime: string
      endTime: string
    }[]) => {
      // First delete existing availability for this contractor
      await supabase
        .from("contractor_availability")
        .delete()
        .eq("contractor_id", contractorId)

      // Then insert the new schedule
      const { data, error } = await supabase
        .from("contractor_availability")
        .insert(
          scheduleData.map(schedule => ({
            contractor_id: contractorId,
            day_of_week: schedule.dayOfWeek,
            start_time: schedule.startTime,
            end_time: schedule.endTime,
          }))
        )
        .select()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-weekly-availability"] })
      toast.success("Availability schedule updated successfully")
      setIsEditingSchedule(false)
    },
    onError: (error) => {
      console.error("Error updating availability:", error)
      toast.error("Failed to update availability schedule")
    },
  })

  const updateDayExceptionMutation = useMutation({
    mutationFn: async ({ date, isAvailable }: DayAvailability) => {
      if (!isAvailable) {
        const { error } = await supabase
          .from("contractor_day_exceptions")
          .upsert({
            contractor_id: contractorId,
            exception_date: date,
            is_available: false,
          })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("contractor_day_exceptions")
          .delete()
          .eq("contractor_id", contractorId)
          .eq("exception_date", date)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-day-exceptions"] })
      toast.success("Day availability updated successfully")
    },
    onError: (error) => {
      console.error("Error updating day exception:", error)
      toast.error("Failed to update day availability")
    },
  })

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

  if (isLoadingWeekly || isLoadingExceptions) {
    return <div>Loading availability...</div>
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
          <Clock className="mr-2 h-4 w-4" />
          Set Weekly Schedule
        </Button>
      </div>

      <div className="rounded-lg border">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date)
              handleDayClick(date)
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

      <div className="text-sm text-muted-foreground">
        Click on a date to mark it as unavailable/available
      </div>

      {isEditingSchedule && (
        <WeeklyScheduleEditor
          availability={weeklyAvailability}
          onSave={async (scheduleData) => {
            await updateAvailabilityMutation.mutateAsync(scheduleData)
          }}
          onCancel={() => setIsEditingSchedule(false)}
        />
      )}
    </div>
  )
}