import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComplianceDocument {
  id: string;
  contractor_id: string;
  document_type: string;
  document_number: string;
  verification_status: string;
  expiration_date: string;
  contractor?: {
    business_name: string;
  };
}

export function ComplianceTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['compliance-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_compliance_documents')
        .select(`
          *,
          contractor:contractors(business_name)
        `)
        .order('expiration_date', { ascending: true });

      if (error) throw error;
      return data as ComplianceDocument[];
    },
  });

  const verifyDocument = async (documentId: string) => {
    const { error } = await supabase
      .from('contractor_compliance_documents')
      .update({ 
        verification_status: 'verified',
        verified_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to verify document",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Document verified successfully",
      });
      // Use the correct type for invalidateQueries
      await queryClient.invalidateQueries({ queryKey: ['compliance-documents'] });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contractor</TableHead>
          <TableHead>Document Type</TableHead>
          <TableHead>Document Number</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expiration</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents?.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>{doc.contractor?.business_name}</TableCell>
            <TableCell>{doc.document_type}</TableCell>
            <TableCell>{doc.document_number}</TableCell>
            <TableCell>
              {doc.verification_status === 'verified' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </TableCell>
            <TableCell>
              {new Date(doc.expiration_date).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {doc.verification_status !== 'verified' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => verifyDocument(doc.id)}
                >
                  Verify
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}