import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { DocumentList } from "./DocumentList";
import { SearchBar } from "../communication/SearchBar";
import { UploadButton } from "./UploadButton";
import { File, FileText, FileImage } from "lucide-react";

const ALLOWED_FILE_TYPES = {
  'application/pdf': { icon: FileText, label: 'PDF' },
  'image/jpeg': { icon: FileImage, label: 'Image' },
  'image/png': { icon: FileImage, label: 'Image' },
  'application/zip': { icon: File, label: 'Archive' },
  'application/x-zip-compressed': { icon: File, label: 'Archive' },
  'application/msword': { icon: FileText, label: 'Document' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'Document' },
};

interface DocumentRepositoryProps {
  projectId: string;
}

export function DocumentRepository({ projectId }: DocumentRepositoryProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: documents, isLoading } = useQuery({
    queryKey: ['project-documents', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_contracts')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      return data;
    }
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(fileType)) {
      toast({
        title: "Error",
        description: "File type not supported",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${projectId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Project Documents</span>
          <UploadButton 
            onUpload={handleUpload}
            acceptedTypes={Object.keys(ALLOWED_FILE_TYPES).join(',')}
          />
        </CardTitle>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </CardHeader>
      <CardContent>
        <DocumentList 
          documents={documents || []} 
          searchTerm={searchTerm} 
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}