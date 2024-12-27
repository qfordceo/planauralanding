import React from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"

export function PurchasesTable() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['floor-plan-purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('floor_plan_purchases')
        .select(`
          *,
          profiles:user_id (email),
          floor_plans:floor_plan_id (name)
        `)
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) return <div>Loading purchases...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Email</TableHead>
            <TableHead>Floor Plan</TableHead>
            <TableHead>Purchase Amount</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Commission Paid</TableHead>
            <TableHead>Purchase Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases?.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.profiles?.email}</TableCell>
              <TableCell>{purchase.floor_plans?.name}</TableCell>
              <TableCell>{formatPrice(purchase.purchase_amount)}</TableCell>
              <TableCell>{formatPrice(purchase.commission_amount)}</TableCell>
              <TableCell>{purchase.commission_paid ? "Yes" : "No"}</TableCell>
              <TableCell>{new Date(purchase.purchase_date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}