import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DocumentFormFields } from "./DocumentFormFields";
import type { DocumentFormData, DocumentType } from "./types";

const formSchema = z.object({
  document_type: z.enum([
    "license",
    "insurance",
    "certification",
    "permit",
    "tax_document",
    "background_check",
    "safety_certification",
    "bond"
  ] as const),
  document_number: z.string().optional(),
  issuing_authority: z.string().optional(),
  expiration_date: z.string().optional(),
  file: z.instanceof(File),
});

interface DocumentUploadProps {
  contractorId: string;
  onSuccess: () => void;
}

export function DocumentUpload({ contractorId, onSuccess }: DocumentUploadProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<DocumentFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: DocumentFormData) => {
    try {
      setIsUploading(true);

      const fileExt = data.file.name.split('.').pop();
      const filePath = `${contractorId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('compliance-docs')
        .upload(filePath, data.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('compliance-docs')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('contractor_compliance_documents')
        .insert({
          contractor_id: contractorId,
          document_type: data.document_type,
          document_number: data.document_number,
          issuing_authority: data.issuing_authority,
          expiration_date: data.expiration_date,
          document_url: publicUrl,
        });

      if (dbError) throw dbError;

      onSuccess();
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Compliance Document</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DocumentFormFields form={form} />
            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Document'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}