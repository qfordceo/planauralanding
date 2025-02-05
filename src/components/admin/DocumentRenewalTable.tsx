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
import { Calendar, AlertTriangle, CheckCircle, AlertOctagon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function DocumentRenewalTable() {
  const { toast } = useToast()
  const { data: renewals, isLoading } = useQuery({
    queryKey: ['document-renewals'],
    queryFn: async () => {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { data, error } = await supabase
        .from('contractor_compliance_documents')
        .select(`
          *,
          contractors (business_name)
        `)
        .lte('expiration_date', thirtyDaysFromNow.toISOString())
        .gt('expiration_date', new Date().toISOString())
        .order('expiration_date', { ascending: true })
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) return <div>Loading renewal requirements...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contractor</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Days Until Expiry</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renewals?.map((doc) => {
            const daysUntilExpiry = Math.ceil(
              (new Date(doc.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            
            return (
              <TableRow 
                key={doc.id}
                className={cn(
                  daysUntilExpiry <= 7 && "bg-red-50",
                  daysUntilExpiry <= 14 && daysUntilExpiry > 7 && "bg-yellow-50"
                )}
              >
                <TableCell>{doc.contractors?.business_name}</TableCell>
                <TableCell className="capitalize">{doc.document_type.replace('_', ' ')}</TableCell>
                <TableCell>{new Date(doc.expiration_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {daysUntilExpiry <= 3 ? (
                      <AlertOctagon className="h-4 w-4 text-red-600 animate-pulse" />
                    ) : daysUntilExpiry <= 7 ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : daysUntilExpiry <= 14 ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Calendar className="h-4 w-4 text-blue-500" />
                    )}
                    <span className={cn(
                      "font-medium",
                      daysUntilExpiry <= 3 && "text-red-600",
                      daysUntilExpiry <= 7 && daysUntilExpiry > 3 && "text-red-500",
                      daysUntilExpiry <= 14 && daysUntilExpiry > 7 && "text-yellow-500"
                    )}>
                      {daysUntilExpiry} days
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant={daysUntilExpiry <= 7 ? "destructive" : "outline"} 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Reminder Sent",
                        description: "Renewal reminder has been sent to the contractor.",
                      })
                    }}
                  >
                    Send Reminder
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}