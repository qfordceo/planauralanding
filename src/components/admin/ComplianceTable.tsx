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
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminVerification } from "../contractor/compliance/AdminVerification"

export function ComplianceTable() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['compliance-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_compliance_documents')
        .select(`
          *,
          contractors (business_name),
          verification_logs (
            verification_status,
            verification_data,
            created_at
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) return <div>Loading compliance documents...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contractor</TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Verified</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents?.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.contractors?.business_name}</TableCell>
              <TableCell className="capitalize">{doc.document_type.replace('_', ' ')}</TableCell>
              <TableCell>
                {doc.verification_status === 'verified' ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <ShieldCheck className="h-4 w-4" />
                    Verified
                  </div>
                ) : doc.verification_status === 'pending' ? (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Shield className="h-4 w-4" />
                    Pending
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <ShieldAlert className="h-4 w-4" />
                    Rejected
                  </div>
                )}
              </TableCell>
              <TableCell>
                {doc.verified_at ? new Date(doc.verified_at).toLocaleDateString() : 'Never'}
              </TableCell>
              <TableCell>
                {doc.expiration_date ? new Date(doc.expiration_date).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell>
                <AdminVerification 
                  document={doc} 
                  onVerificationComplete={() => {
                    // Refetch the data
                    queryClient.invalidateQueries(['compliance-documents'])
                  }} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}