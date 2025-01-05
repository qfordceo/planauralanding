import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VersionBadgeProps } from "../../interfaces/types";

export function VersionBadge({ version, isLatest, isCurrent }: VersionBadgeProps) {
  return (
    <Badge
      variant={isLatest ? "default" : isCurrent ? "secondary" : "outline"}
      className={cn(
        "text-xs",
        isLatest && "bg-green-500 hover:bg-green-600",
        isCurrent && !isLatest && "bg-blue-500 hover:bg-blue-600"
      )}
    >
      v{version}
      {isLatest && " (Latest)"}
      {isCurrent && !isLatest && " (Current)"}
    </Badge>
  );
}