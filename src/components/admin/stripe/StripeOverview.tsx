import { TabsContent } from "@/components/ui/tabs"
import { FinancialMetrics } from "./FinancialMetrics"
import { RecentTransactions } from "./RecentTransactions"

interface StripeOverviewProps {
  totalRevenue: number
  monthlyRevenue: number
  totalExpenses: number
  purchases: any[]
}

export function StripeOverview({ 
  totalRevenue, 
  monthlyRevenue, 
  totalExpenses,
  purchases 
}: StripeOverviewProps) {
  return (
    <TabsContent value="overview" className="space-y-6">
      <FinancialMetrics 
        totalRevenue={totalRevenue} 
        monthlyRevenue={monthlyRevenue} 
        totalExpenses={totalExpenses}
      />
      <RecentTransactions transactions={purchases} />
    </TabsContent>
  )
}