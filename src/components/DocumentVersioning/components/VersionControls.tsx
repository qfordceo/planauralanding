import { Button } from "@/components/ui/button";
import { VersionControlsProps } from "../interfaces/types";
import { Plus, RotateCcw } from "lucide-react";

export function VersionControls({
  onCreateVersion,
  onRevertVersion,
  canCreateVersion,
  canRevertVersion,
  isLoading
}: VersionControlsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onCreateVersion}
        disabled={!canCreateVersion || isLoading}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create Version
      </Button>
      <Button
        onClick={() => onRevertVersion(1)}
        disabled={!canRevertVersion || isLoading}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Revert
      </Button>
    </div>
  );
}