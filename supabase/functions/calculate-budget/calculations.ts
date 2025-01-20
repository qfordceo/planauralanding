import { MaterialCost, MarketRate, CostBreakdown } from './types';

export function calculateTotalCosts(
  materials: MaterialCost[],
  marketRates: MarketRate
): CostBreakdown {
  const materialCost = materials.reduce(
    (sum, material) => sum + (material.price_per_unit * material.quantity),
    0
  ) * marketRates.material_multiplier;

  const laborCost = materialCost * 0.4 * marketRates.labor_multiplier; // 40% of material cost as baseline
  const overheadCost = (materialCost + laborCost) * 0.15 * marketRates.overhead_multiplier; // 15% overhead

  return {
    materials: materialCost,
    labor: laborCost,
    overhead: overheadCost,
    total: materialCost + laborCost + overheadCost
  };
}