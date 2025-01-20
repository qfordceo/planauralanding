import type { MarketRates, MaterialCosts, BudgetResult } from './types.ts';

const OVERHEAD_PERCENTAGE = 0.15;
const CONTINGENCY_PERCENTAGE = 0.10;

export function calculateTotalBudget(
  marketRates: MarketRates,
  materialCosts: MaterialCosts
): BudgetResult {
  // Calculate base material cost with market multiplier
  const totalMaterialCost = (materialCosts.baseMaterials + materialCosts.customMaterials) 
    * marketRates.materialMultiplier 
    * (1 + materialCosts.wastageEstimate);

  // Calculate labor cost based on material cost and labor rate
  const laborCost = totalMaterialCost * marketRates.laborRate * marketRates.locationFactor;

  // Calculate overhead and contingency
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * OVERHEAD_PERCENTAGE;
  const contingency = subtotal * CONTINGENCY_PERCENTAGE;

  // Calculate total cost
  const totalCost = subtotal + overhead + contingency;

  return {
    totalCost,
    breakdown: {
      materials: totalMaterialCost,
      labor: laborCost,
      overhead,
      contingency
    },
    marketFactors: marketRates
  };
}