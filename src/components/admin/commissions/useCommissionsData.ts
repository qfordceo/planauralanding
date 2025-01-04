import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useCommissionsData() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ["floor-plan-purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("floor_plan_purchases")
        .select(`
          *,
          profiles:user_id (email),
          floor_plans:floor_plan_id (name)
        `)
        .order("purchase_date", { ascending: false })

      if (error) throw error
      return data
    },
  })

  const totalCommissions = purchases?.reduce(
    (sum, purchase) => sum + (purchase.commission_amount || 0),
    0
  )

  const unpaidCommissions = purchases?.reduce(
    (sum, purchase) =>
      purchase.commission_paid ? sum : sum + (purchase.commission_amount || 0),
    0
  )

  return {
    purchases,
    isLoading,
    totalCommissions,
    unpaidCommissions,
  }
}