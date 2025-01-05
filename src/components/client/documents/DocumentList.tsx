import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { DocumentVersion } from "@/types/documents";
import { supabase } from "@/integrations/supabase/client";
import { DocumentListItem } from "./DocumentListItem";
import { VersionHistory } from "./VersionHistory";

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
      {filteredDocuments?.map((doc) => (
        <DocumentListItem
          key={doc.id}
          {...doc}
          onDownload={onDownloadVersion}
          onViewHistory={handleViewVersions}
        />
      ))}

      <VersionHistory
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        versions={versions}
        isLoading={isLoadingVersions}
        onDownloadVersion={onDownloadVersion}
      />
    </div>
  );
}