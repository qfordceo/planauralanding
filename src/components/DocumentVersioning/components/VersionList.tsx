import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { VersionListProps } from "../interfaces/types";
import { VersionBadge } from "./shared/VersionBadge";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function VersionList({ 
  versions, 
  currentVersion, 
  onVersionSelect,
  isLoading 
}: VersionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 p-1">
        {versions.map((version) => (
          <Button
            key={version.version_number}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onVersionSelect(version.version_number)}
          >
            <div className="flex items-center justify-between w-full">
              <VersionBadge
                version={version.version_number}
                isLatest={version.version_number === Math.max(...versions.map(v => v.version_number))}
                isCurrent={version.version_number === currentVersion}
              />
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}