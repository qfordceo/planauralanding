import { Button } from "@/components/ui/button";
import { FileText, File, Image, FileArchive } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content_type: string;
}

interface DocumentListProps {
  documents: Document[];
  searchTerm: string;
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

export function DocumentList({ documents, searchTerm }: DocumentListProps) {
  const getFileIcon = (contentType: string) => {
    const fileConfig = ALLOWED_FILE_TYPES[contentType as keyof typeof ALLOWED_FILE_TYPES];
    return fileConfig?.icon || File;
  };

  const filteredDocuments = documents?.filter(doc =>
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
  );
}