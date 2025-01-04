import { Button } from "@/components/ui/button";
import { FileText, File, FileImage } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Document {
  id: string;
  title: string;
  content_type: string;
}

interface DocumentListProps {
  documents: Document[];
  searchTerm: string;
  isLoading: boolean;
}

const ALLOWED_FILE_TYPES = {
  'application/pdf': { icon: FileText, label: 'PDF' },
  'image/jpeg': { icon: FileImage, label: 'Image' },
  'image/png': { icon: FileImage, label: 'Image' },
  'application/zip': { icon: File, label: 'Archive' },
  'application/x-zip-compressed': { icon: File, label: 'Archive' },
  'application/msword': { icon: FileText, label: 'Document' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'Document' },
};

export function DocumentList({ documents, searchTerm, isLoading }: DocumentListProps) {
  const getFileIcon = (contentType: string) => {
    const fileConfig = ALLOWED_FILE_TYPES[contentType as keyof typeof ALLOWED_FILE_TYPES];
    return fileConfig?.icon || File;
  };

  const filteredDocuments = documents?.filter(doc =>
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  );
}