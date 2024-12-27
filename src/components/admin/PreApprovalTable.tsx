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

export function PreApprovalTable() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles-preapproval'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('preapproval_status', 'eq', null)
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) return <div>Loading pre-approvals...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Pre-approval Status</TableHead>
            <TableHead>Pre-approval Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles?.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.email}</TableCell>
              <TableCell>{profile.phone || "N/A"}</TableCell>
              <TableCell>{profile.address || "N/A"}</TableCell>
              <TableCell className="capitalize">{profile.preapproval_status}</TableCell>
              <TableCell>
                {profile.preapproval_amount 
                  ? formatPrice(profile.preapproval_amount)
                  : "N/A"
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}