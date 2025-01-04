import { Clock, Briefcase, MessageCircle } from "lucide-react";
import type { ContractorMetrics } from "@/types/contractor";

interface PerformanceMetricsProps {
  metrics: ContractorMetrics;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">On-Time Rate</p>
          <p className="text-2xl font-bold">{metrics.onTimeRate.toFixed(1)}%</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        <Briefcase className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Projects Completed</p>
          <p className="text-2xl font-bold">{metrics.completedProjects}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        <MessageCircle className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Response Rate</p>
          <p className="text-2xl font-bold">94%</p>
        </div>
      </div>
    </div>
  );
}