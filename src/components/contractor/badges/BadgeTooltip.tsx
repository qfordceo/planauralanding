import { TooltipContent } from "@/components/ui/tooltip";

interface BadgeTooltipProps {
  description: string;
  criteria: string;
}

export function BadgeTooltip({ description, criteria }: BadgeTooltipProps) {
  return (
    <TooltipContent>
      <div className="space-y-2">
        <p className="font-medium">{description}</p>
        <p className="text-sm text-muted-foreground">Criteria: {criteria}</p>
      </div>
    </TooltipContent>
  );
}