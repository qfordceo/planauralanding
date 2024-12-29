import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { DocumentList } from "./DocumentList";
import { DocumentUpload } from "./DocumentUpload";
import { useToast } from "@/hooks/use-toast";
import type { ComplianceDocument } from "@/types/compliance";

interface ComplianceDocumentsProps {
  contractorId: string;
}

export function ComplianceDocuments({ contractorId }: ComplianceDocumentsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ["compliance-documents", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_compliance_documents")
        .select("*")
        .eq("contractor_id", contractorId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ComplianceDocument[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Compliance Documents</h3>
        <DocumentUpload 
          contractorId={contractorId}
          onSuccess={() => {
            refetch();
            toast({
              title: "Document uploaded",
              description: "Your document has been uploaded successfully.",
            });
          }}
        />
      </div>
      
      <DocumentList 
        documents={documents || []}
        onStatusChange={() => refetch()}
      />
    </div>
  );
}