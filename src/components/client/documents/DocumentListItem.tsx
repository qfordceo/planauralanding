import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ALLOWED_FILE_TYPES } from "@/constants/fileTypes";

interface DocumentListItemProps {
  id: string;
  title: string;
  content_type: string;
  current_version: number;
  onDownload: (id: string, version: number) => void;
  onViewHistory: (id: string) => void;
}

export function DocumentListItem({ 
  id, 
  title, 
  content_type, 
  current_version,
  onDownload,
  onViewHistory
}: DocumentListItemProps) {
  const getFileIcon = (contentType: string): LucideIcon => {
    const fileConfig = ALLOWED_FILE_TYPES[contentType as keyof typeof ALLOWED_FILE_TYPES];
    return fileConfig?.icon || File;
  };

  const IconComponent = getFileIcon(content_type || 'application/octet-stream');

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3">
        <IconComponent className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{title || 'Untitled Document'}</span>
        <span className="text-sm text-muted-foreground">v{current_version}</span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDownload(id, current_version)}
        >
          Download
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewHistory(id)}
        >
          <IconComponent className="h-4 w-4 mr-2" />
          History
        </Button>
      </div>
    </div>
  );
}