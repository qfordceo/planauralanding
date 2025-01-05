import { Card } from "@/components/ui/card";
import { VersionDiffProps } from "../interfaces/types";
import { DiffViewer } from "./shared/DiffViewer";
import { useVersionDiff } from "../hooks/useVersionDiff";

export function VersionDiff({ previousVersion, currentVersion }: VersionDiffProps) {
  const diff = useVersionDiff(previousVersion, currentVersion);

  if (!diff) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Changes</h3>
      <DiffViewer 
        diff={diff} 
        className="h-[300px]" 
        currentVersion={currentVersion}
      />
    </Card>
  );
}