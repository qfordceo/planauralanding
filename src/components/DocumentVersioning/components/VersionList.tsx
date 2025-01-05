import { ScrollArea } from "@/components/ui/scroll-area";
import { VersionListProps } from "../interfaces/types";
import { VersionListItem } from "./shared/VersionListItem";
import { VersionListSkeleton } from "./shared/VersionListSkeleton";

export function VersionList({ 
  versions, 
  currentVersion, 
  onVersionSelect,
  isLoading 
}: VersionListProps) {
  if (isLoading) {
    return <VersionListSkeleton />;
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2 p-1">
        {versions.map((version) => (
          <VersionListItem
            key={version.version_number}
            version={version}
            isLatest={version.version_number === Math.max(...versions.map(v => v.version_number))}
            isCurrent={version.version_number === currentVersion}
            onSelect={onVersionSelect}
          />
        ))}
      </div>
    </ScrollArea>
  );
}