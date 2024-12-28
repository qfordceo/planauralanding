import { useQuery } from "@tanstack/react-query"
import { DollarSign, TrendingUp, Wallet } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function FinancialOverview() {
  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ["floor-plan-purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("floor_plan_purchases")
        .select("*")
      if (error) throw error
      return data
    },
  })

  const totalRevenue = purchases?.reduce(
    (sum, purchase) => sum + purchase.purchase_amount,
    0
  ) || 0

  const totalCommissions = purchases?.reduce(
    (sum, purchase) => sum + purchase.commission_amount,
    0
  ) || 0

  const netRevenue = totalRevenue - totalCommissions

  if (purchasesLoading) {
    return <div>Loading financial data...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Financial Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commissions Paid
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCommissions.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}