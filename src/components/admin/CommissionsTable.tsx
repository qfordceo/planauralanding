import { useQuery } from "@tanstack/react-query"
import { DollarSign } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CommissionsTable() {
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

  if (isLoading) return <div>Loading...</div>

  const totalCommissions = purchases?.reduce(
    (sum, purchase) => sum + (purchase.commission_amount || 0),
    0
  )

  const unpaidCommissions = purchases?.reduce(
    (sum, purchase) =>
      purchase.commission_paid ? sum : sum + (purchase.commission_amount || 0),
    0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Commissions Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${totalCommissions?.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Unpaid Commissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ${unpaidCommissions?.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Floor Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases?.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>
                  {new Date(purchase.purchase_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{purchase.profiles?.email}</TableCell>
                <TableCell>{purchase.floor_plans?.name}</TableCell>
                <TableCell>${purchase.purchase_amount}</TableCell>
                <TableCell>${purchase.commission_amount}</TableCell>
                <TableCell>
                  {purchase.commission_paid ? "Paid" : "Pending"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}