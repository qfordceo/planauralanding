import { Button } from "@/components/ui/button";
import { VersionBadge } from "./VersionBadge";
import { formatDistanceToNow } from "date-fns";
import { DocumentVersion } from "@/types/documents";

interface VersionListItemProps {
  version: DocumentVersion;
  isLatest: boolean;
  isCurrent: boolean;
  onSelect: (versionNumber: number) => void;
}

export function VersionListItem({ 
  version, 
  isLatest, 
  isCurrent, 
  onSelect 
}: VersionListItemProps) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => onSelect(version.version_number)}
    >
      <div className="flex items-center justify-between w-full">
        <VersionBadge
          version={version.version_number}
          isLatest={isLatest}
          isCurrent={isCurrent}
        />
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
        </span>
      </div>
    </Button>
  );
}