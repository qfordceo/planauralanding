import { ScrollArea } from "@/components/ui/scroll-area";
import { DiffViewerProps } from "../../interfaces/types";
import { Plus, Minus, RefreshCw } from "lucide-react";

export function DiffViewer({ diff, className }: DiffViewerProps) {
  return (
    <ScrollArea className={className}>
      <div className="space-y-2 p-4">
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
    </ScrollArea>
  );
}