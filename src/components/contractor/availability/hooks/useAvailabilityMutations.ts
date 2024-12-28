import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface DayAvailability {
  date: string
  isAvailable: boolean
}

export function useAvailabilityMutations(contractorId: string) {
  const queryClient = useQueryClient()

  const updateAvailabilityMutation = useMutation({
    mutationFn: async (scheduleData: {
      contractorId: string
      dayOfWeek: number
      startTime: string
      endTime: string
    }[]) => {
      await supabase
        .from("contractor_availability")
        .delete()
        .eq("contractor_id", contractorId)

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

  return {
    updateAvailabilityMutation,
    updateDayExceptionMutation,
  }
}