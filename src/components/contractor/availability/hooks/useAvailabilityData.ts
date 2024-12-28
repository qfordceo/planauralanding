import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { ContractorDayException } from "@/types/contractor"

export function useAvailabilityData(contractorId: string) {
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

  const { data: dayExceptions, isLoading: isLoadingExceptions } = useQuery<ContractorDayException[]>({
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

  return {
    weeklyAvailability,
    dayExceptions,
    isLoading: isLoadingWeekly || isLoadingExceptions,
  }
}