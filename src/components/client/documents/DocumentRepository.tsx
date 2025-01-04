import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { DocumentList } from "./DocumentList";
import { SearchBar } from "../communication/SearchBar";
import { UploadButton } from "./UploadButton";

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

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document version
      const { data: document, error: documentError } = await supabase
        .from('project_contracts')
        .insert({
          project_id: projectId,
          title: file.name,
          content_type: file.type,
          current_version: 1,
        })
        .select()
        .single();

      if (documentError) throw documentError;

      // Create initial version
      const { error: versionError } = await supabase
        .from('document_versions')
        .insert({
          document_id: document.id,
          version_number: 1,
          file_path: filePath,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          metadata: {
            original_name: file.name,
            size: file.size,
            type: file.type,
          },
        });

      if (versionError) throw versionError;

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

  const handleDownloadVersion = async (documentId: string, version: number) => {
    try {
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .select('file_path')
        .eq('document_id', documentId)
        .eq('version_number', version)
        .single();

      if (versionError) throw versionError;

      const { data, error: downloadError } = await supabase.storage
        .from('project-documents')
        .download(versionData.file_path);

      if (downloadError) throw downloadError;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = versionData.file_path.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
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
          onDownloadVersion={handleDownloadVersion}
        />
      </CardContent>
    </Card>
  );
}