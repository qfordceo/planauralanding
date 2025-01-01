import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Clock, Star, Wrench, MessageCircle, RotateCcw, Trophy, BarChart3, Medal, CheckCircle, Receipt, Lock } from "lucide-react";

export type BadgeType = 
  | "expeditious"
  | "clientFavorite" 
  | "precision"
  | "responsive"
  | "adaptable"
  | "topContractor"
  | "highVolume"
  | "preferred"
  | "compliant"
  | "paperwork"
  | "safety";

interface BadgeConfig {
  icon: React.ReactNode;
  label: string;
  description: string;
  criteria: string;
}

const badgeConfigs: Record<BadgeType, BadgeConfig> = {
  expeditious: {
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    label: "Expeditious & Efficient",
    description: "Consistently completes projects ahead of schedule",
    criteria: "95%+ on-time completion rate"
  },
  clientFavorite: {
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    label: "Client Favorite",
    description: "Consistently high client ratings",
    criteria: "4.8/5+ average rating (10+ projects)"
  },
  precision: {
    icon: <Wrench className="h-5 w-5 text-purple-500" />,
    label: "Precision & Quality",
    description: "Exceptional craftsmanship",
    criteria: "Less than 2% callbacks"
  },
  responsive: {
    icon: <MessageCircle className="h-5 w-5 text-green-500" />,
    label: "Responsive Communicator",
    description: "Excellent communication",
    criteria: "90%+ response rate within 24h"
  },
  adaptable: {
    icon: <RotateCcw className="h-5 w-5 text-orange-500" />,
    label: "Adaptable Problem Solver",
    description: "Navigates challenges effectively",
    criteria: "Minimal escalations"
  },
  topContractor: {
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
    label: "Top Contractor",
    description: "Excellence across metrics",
    criteria: "3+ core badges"
  },
  highVolume: {
    icon: <BarChart3 className="h-5 w-5 text-indigo-500" />,
    label: "High Volume Performer",
    description: "Handles many projects successfully",
    criteria: "20+ projects/year"
  },
  preferred: {
    icon: <Award className="h-5 w-5 text-rose-500" />,
    label: "Preferred Partner",
    description: "Long-standing excellence",
    criteria: "1+ year with high performance"
  },
  compliant: {
    icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    label: "Fully Compliant",
    description: "Perfect compliance record",
    criteria: "No compliance issues for 1 year"
  },
  paperwork: {
    icon: <Receipt className="h-5 w-5 text-cyan-500" />,
    label: "Paperwork Pro",
    description: "Timely documentation",
    criteria: "No documentation delays"
  },
  safety: {
    icon: <Lock className="h-5 w-5 text-red-500" />,
    label: "Safety First",
    description: "Excellent safety record",
    criteria: "Zero safety violations"
  }
};

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
        <TooltipContent>
          <div className="space-y-2">
            <p className="font-medium">{config.description}</p>
            <p className="text-sm text-muted-foreground">Criteria: {config.criteria}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}