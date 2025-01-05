import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentVersion } from "@/types/documents";
import { formatDistanceToNow } from "date-fns";

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: DocumentVersion[];
  isLoading: boolean;
  onDownloadVersion: (documentId: string, version: number) => void;
}

export function VersionHistory({
  isOpen,
  onClose,
  versions,
  isLoading,
  onDownloadVersion
}: VersionHistoryProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {isLoading ? (
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
  );
}