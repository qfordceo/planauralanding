import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPrice } from "@/lib/utils";

interface CostSummaryProps {
  landCost: number;
  targetBuildCost: number;
  totalEstimatedCost: number;
  totalAwardedCost: number;
  totalActualCost: number;
}

export function CostSummary({
  landCost,
  targetBuildCost,
  totalEstimatedCost,
  totalAwardedCost,
  totalActualCost,
}: CostSummaryProps) {
  const progressPercentage = (totalActualCost / targetBuildCost) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Cost Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Land Cost</span>
              <span>{formatPrice(landCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Target Build Cost</span>
              <span>{formatPrice(targetBuildCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Estimated</span>
              <span>{formatPrice(totalEstimatedCost)}</span>
            </div>
            {totalAwardedCost > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Total Awarded</span>
                <span>{formatPrice(totalAwardedCost)}</span>
              </div>
            )}
            {totalActualCost > 0 && (
              <div className="flex justify-between font-medium">
                <span>Total Actual</span>
                <span>{formatPrice(totalActualCost)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Progress</h4>
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round(progressPercentage)}% of target budget used
          </p>
        </div>
      </div>
    </div>
  );
}