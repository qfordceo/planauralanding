import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BadgeTooltip } from "./BadgeTooltip";
import { BadgeType, badgeConfigs } from "./BadgeConfig";

interface PerformanceBadgeProps {
  type: BadgeType;
  earned?: boolean;
}

export function PerformanceBadge({ type, earned = false }: PerformanceBadgeProps) {
  const config = badgeConfigs[type];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 
            ${earned ? 'bg-white shadow-sm' : 'bg-gray-100 opacity-50'}`}>
            {config.icon}
            <span className="text-sm font-medium">{config.label}</span>
          </div>
        </TooltipTrigger>
        <BadgeTooltip 
          description={config.description}
          criteria={config.criteria}
        />
      </Tooltip>
    </TooltipProvider>
  );
}