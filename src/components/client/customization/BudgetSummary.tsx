import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface BudgetSummaryProps {
  isLoading: boolean;
  budgetAnalysis?: {
    baseCost: number;
    customizationCost: number;
    totalCost: number;
  };
}

export function BudgetSummary({ isLoading, budgetAnalysis }: BudgetSummaryProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!budgetAnalysis) return null;

  return (
    <div className="space-y-2 p-4 bg-muted rounded-lg">
      <h3 className="font-semibold">Budget Summary</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Base Cost</span>
          <span>{formatPrice(budgetAnalysis.baseCost)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Customizations</span>
          <span>{formatPrice(budgetAnalysis.customizationCost)}</span>
        </div>
        
        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
          <span>Total Cost</span>
          <span>{formatPrice(budgetAnalysis.totalCost)}</span>
        </div>
      </div>
    </div>
  );
}