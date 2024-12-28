import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { FinancialMetrics } from "./stripe/FinancialMetrics"
import { RecentTransactions } from "./stripe/RecentTransactions"
import { ExpensesOverview } from "./stripe/ExpensesOverview"
import { SubscriptionsOverview } from "./stripe/SubscriptionsOverview"

export function StripeDashboard() {
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

  if (isLoading) return <div>Loading financial data...</div>

  const totalRevenue = purchases?.reduce(
    (sum, purchase) => sum + purchase.purchase_amount,
    0
  ) || 0

  const monthlyRevenue = purchases?.reduce((sum, purchase) => {
    const purchaseDate = new Date(purchase.purchase_date)
    const currentDate = new Date()
    if (
      purchaseDate.getMonth() === currentDate.getMonth() &&
      purchaseDate.getFullYear() === currentDate.getFullYear()
    ) {
      return sum + purchase.purchase_amount
    }
    return sum
  }, 0)

  // Mock data for expenses - will be replaced with Stripe data
  const mockExpenses = {
    marketing: 2500,
    operations: 3500,
    software: 1200,
    total: 7200
  }

  // Mock data for subscriptions - will be replaced with Stripe data
  const mockSubscriptions = {
    active: 150,
    canceled: 12,
    revenue: 14850
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <FinancialMetrics 
            totalRevenue={totalRevenue} 
            monthlyRevenue={monthlyRevenue} 
            totalExpenses={mockExpenses.total}
          />
          <RecentTransactions transactions={purchases || []} />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <ExpensesOverview expenses={mockExpenses} />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <SubscriptionsOverview subscriptions={mockSubscriptions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}