import { Button } from "@/components/ui/button";
import { FileText, File, FileImage, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { DocumentVersion } from "@/types/documents";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { ALLOWED_FILE_TYPES } from "@/constants/fileTypes";
import { LucideIcon } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content_type: string;
  current_version: number;
}

interface DocumentListProps {
  documents: Document[];
  searchTerm: string;
  isLoading: boolean;
  onDownloadVersion: (documentId: string, version: number) => void;
}

export function DocumentList({ documents, searchTerm, isLoading, onDownloadVersion }: DocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

  const getFileIcon = (contentType: string): LucideIcon => {
    const fileConfig = ALLOWED_FILE_TYPES[contentType as keyof typeof ALLOWED_FILE_TYPES];
    return fileConfig?.icon || File;
  };

  const filteredDocuments = documents?.filter(doc =>
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewVersions = async (documentId: string) => {
    setSelectedDocument(documentId);
    setIsLoadingVersions(true);
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!filteredDocuments?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No documents found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredDocuments?.map((doc) => {
        const IconComponent = getFileIcon(doc.content_type || 'application/octet-stream');
        return (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <IconComponent className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{doc.title || 'Untitled Document'}</span>
              <span className="text-sm text-muted-foreground">v{doc.current_version}</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDownloadVersion(doc.id, doc.current_version)}
              >
                Download
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleViewVersions(doc.id)}
              >
                <Clock className="h-4 w-4 mr-2" />
                History
              </Button>
            </div>
          </div>
        );
      })}

      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {isLoadingVersions ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">Version {version.version_number}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownloadVersion(version.document_id, version.version_number)}
                  >
                    Download
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}