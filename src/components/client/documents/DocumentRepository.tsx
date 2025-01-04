import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Search, File, Image, FileArchive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DocumentRepositoryProps {
  projectId: string;
}

const ALLOWED_FILE_TYPES = {
  'application/pdf': { icon: FileText, label: 'PDF' },
  'image/jpeg': { icon: Image, label: 'Image' },
  'image/png': { icon: Image, label: 'Image' },
  'application/zip': { icon: FileArchive, label: 'Archive' },
  'application/x-zip-compressed': { icon: FileArchive, label: 'Archive' },
  'application/msword': { icon: File, label: 'Document' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: File, label: 'Document' },
};

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

  const getFileIcon = (contentType: string) => {
    const fileConfig = ALLOWED_FILE_TYPES[contentType as keyof typeof ALLOWED_FILE_TYPES];
    return fileConfig?.icon || File;
  };

  const filteredDocuments = documents?.filter(doc =>
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Project Documents</span>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <label className="cursor-pointer">
              Upload Document
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                accept={Object.keys(ALLOWED_FILE_TYPES).join(',')}
              />
            </label>
          </Button>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredDocuments?.map((doc) => {
            const IconComponent = getFileIcon(doc.content_type || 'application/octet-stream');
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <span>{doc.title || 'Untitled Document'}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Preview
                  </Button>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}