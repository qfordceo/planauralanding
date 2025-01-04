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
import { FileCheck, FileX, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function WaiverTable() {
  const { toast } = useToast()
  const { data: waivers, isLoading } = useQuery({
    queryKey: ['liability-waivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_liability_waivers')
        .select(`
          *,
          contractors (business_name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) return <div>Loading waivers...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contractor</TableHead>
            <TableHead>Waiver Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Confirmed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {waivers?.map((waiver) => (
            <TableRow key={waiver.id}>
              <TableCell>{waiver.contractors?.business_name}</TableCell>
              <TableCell className="capitalize">{waiver.waiver_type.replace('_', ' ')}</TableCell>
              <TableCell>
                {waiver.accepted_at ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <FileCheck className="h-4 w-4" />
                    Accepted
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <FileQuestion className="h-4 w-4" />
                    Pending
                  </div>
                )}
              </TableCell>
              <TableCell>
                {waiver.last_confirmed_at ? new Date(waiver.last_confirmed_at).toLocaleDateString() : 'Never'}
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // View waiver details
                    toast({
                      title: "Viewing waiver details",
                      description: "This functionality is coming soon.",
                    })
                  }}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}