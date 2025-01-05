import { ScrollArea } from "@/components/ui/scroll-area";
import { DiffViewerProps } from "../../interfaces/types";
import { Plus, Minus, RefreshCw, Calendar, FileText, User } from "lucide-react";
import { format } from "date-fns";

export function DiffViewer({ diff, className, currentVersion }: DiffViewerProps) {
  return (
    <ScrollArea className={className}>
      <div className="space-y-4 p-4">
        {/* Metadata Section */}
        <div className="space-y-2 border-b pb-4">
          <h4 className="text-sm font-medium text-muted-foreground">Version Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Created: {format(new Date(currentVersion.created_at), 'PPp')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                File: {currentVersion.metadata.original_name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Size: {(currentVersion.metadata.size / 1024).toFixed(2)} KB
              </span>
            </div>
            {currentVersion.metadata.type && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Type: {currentVersion.metadata.type}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Changes Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Changes</h4>
          {diff.added.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium flex items-center gap-2 text-green-500">
                <Plus className="h-4 w-4" /> Added
              </h4>
              {diff.added.map((item, index) => (
                <div key={index} className="text-sm pl-6 text-green-600">
                  {item}
                </div>
              ))}
            </div>
          )}

          {diff.removed.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium flex items-center gap-2 text-red-500">
                <Minus className="h-4 w-4" /> Removed
              </h4>
              {diff.removed.map((item, index) => (
                <div key={index} className="text-sm pl-6 text-red-600">
                  {item}
                </div>
              ))}
            </div>
          )}

          {diff.modified.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium flex items-center gap-2 text-blue-500">
                <RefreshCw className="h-4 w-4" /> Modified
              </h4>
              {diff.modified.map((item, index) => (
                <div key={index} className="text-sm pl-6 text-blue-600">
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}