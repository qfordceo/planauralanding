import { formatPrice } from "@/lib/utils";

interface BuildCostSummaryProps {
  floorPlanCost: number;
  consultingFee: number;
  lineItemsTotal: number;
  targetCost: number;
  compAveragePrice: number;
  landCost: number;
}

export function BuildCostSummary({
  floorPlanCost,
  consultingFee,
  lineItemsTotal,
  targetCost,
  compAveragePrice,
  landCost
}: BuildCostSummaryProps) {
  const totalCost = floorPlanCost + consultingFee + lineItemsTotal + landCost;
  const equity = compAveragePrice ? compAveragePrice - totalCost : 0;
  const equityPercentage = compAveragePrice 
    ? (equity / compAveragePrice) * 100 
    : 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Land Cost</span>
          <span>{formatPrice(landCost)}</span>
        </div>
        <div className="flex justify-between">
          <span>Floor Plan Cost</span>
          <span>{formatPrice(floorPlanCost)}</span>
        </div>
        <div className="flex justify-between">
          <span>Plan Aura Consulting Fee</span>
          <span>{formatPrice(consultingFee)}</span>
        </div>
        <div className="flex justify-between">
          <span>Construction Costs</span>
          <span>{formatPrice(lineItemsTotal)}</span>
        </div>
        <div className="border-t pt-2 font-bold flex justify-between">
          <span>Total Cost</span>
          <span>{formatPrice(totalCost)}</span>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span>Target Build Cost</span>
          <span>{formatPrice(targetCost)}</span>
        </div>
        <div className="flex justify-between">
          <span>Comparable Home Value</span>
          <span>{formatPrice(compAveragePrice)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Potential Equity</span>
          <span>{formatPrice(equity)} ({equityPercentage.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
}