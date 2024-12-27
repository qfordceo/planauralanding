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

export function ClientBuildsTable() {
  const { data: savedBuilds, isLoading } = useQuery({
    queryKey: ['saved-builds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_builds')
        .select(`
          *,
          profiles:user_id (email),
          floor_plans:floor_plan_id (name)
        `)
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) return <div>Loading saved builds...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Email</TableHead>
            <TableHead>Floor Plan</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savedBuilds?.map((build) => (
            <TableRow key={build.id}>
              <TableCell>{build.profiles?.email}</TableCell>
              <TableCell>{build.floor_plans?.name}</TableCell>
              <TableCell>{formatPrice(build.total_cost || 0)}</TableCell>
              <TableCell>{new Date(build.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}