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

type ViewMode = "month" | "week" | "day"

export function AvailabilityManager({ contractorId }: { contractorId: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  
  const queryClient = useQueryClient()

  const { data: availability, isLoading } = useQuery({
    queryKey: ["contractor-availability", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_availability")
        .select("*")
        .eq("contractor_id", contractorId)
      
      if (error) throw error
      return data
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
      queryClient.invalidateQueries({ queryKey: ["contractor-availability"] })
      toast.success("Availability schedule updated successfully")
      setIsEditingSchedule(false)
    },
    onError: (error) => {
      console.error("Error updating availability:", error)
      toast.error("Failed to update availability schedule")
    },
  })

  if (isLoading) {
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
          mode={viewMode}
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>

      {isEditingSchedule && (
        <WeeklyScheduleEditor
          availability={availability}
          onSave={async (scheduleData) => {
            await updateAvailabilityMutation.mutateAsync(scheduleData)
          }}
          onCancel={() => setIsEditingSchedule(false)}
        />
      )}
    </div>
  )
}