import { useQuery } from "@tanstack/react-query"
import { DollarSign, CreditCard, Receipt, TrendingUp } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue?.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyRevenue?.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchases?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases?.slice(0, 5).map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>
                    {new Date(purchase.purchase_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{purchase.profiles?.email}</TableCell>
                  <TableCell>{purchase.floor_plans?.name}</TableCell>
                  <TableCell>${purchase.purchase_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}