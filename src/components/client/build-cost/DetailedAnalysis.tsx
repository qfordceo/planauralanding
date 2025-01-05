import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineItems } from "./LineItems";
import { ProgressTracker } from "@/components/timeline/monitoring/ProgressTracker";

interface DetailedAnalysisProps {
  lineItems: any[];
  milestones: any[];
  completionDate: string;
}

export function DetailedAnalysis({ 
  lineItems, 
  milestones, 
  completionDate 
}: DetailedAnalysisProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium mb-4">Cost Breakdown</h4>
        <LineItems items={lineItems} />
      </div>
      
      <div>
        <h4 className="font-medium mb-4">Progress Tracking</h4>
        <ProgressTracker 
          milestones={milestones} 
          agreedCompletionDate={completionDate}
        />
      </div>
    </div>
  );
}