import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPrice } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  
  const chartData = [
    {
      name: 'Target',
      amount: targetBuildCost,
    },
    {
      name: 'Estimated',
      amount: totalEstimatedCost,
    },
    {
      name: 'Awarded',
      amount: totalAwardedCost,
    },
    {
      name: 'Actual',
      amount: totalActualCost,
    },
  ];

  const totalProjectCost = landCost + totalActualCost;
  const isOverBudget = totalProjectCost > (landCost + targetBuildCost);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-4">Cost Summary</h4>
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
                <span className={isOverBudget ? 'text-red-500' : 'text-green-500'}>
                  {formatPrice(totalActualCost)}
                </span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total Project Cost</span>
                <span className={isOverBudget ? 'text-red-500' : 'text-green-500'}>
                  {formatPrice(totalProjectCost)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Budget Progress</h4>
          <div className="space-y-4">
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}% of target budget used
            </p>
            {isOverBudget && (
              <p className="text-sm text-red-500">
                Warning: Project is currently over budget by {formatPrice(totalProjectCost - (landCost + targetBuildCost))}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="h-[200px] mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatPrice(value)} />
            <Tooltip 
              formatter={(value) => formatPrice(Number(value))}
              labelStyle={{ color: 'black' }}
            />
            <Bar dataKey="amount" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}