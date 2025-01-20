export interface MaterialCost {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
}

export interface MarketRate {
  location: string;
  labor_multiplier: number;
  material_multiplier: number;
  overhead_multiplier: number;
}

export interface CostBreakdown {
  materials: number;
  labor: number;
  overhead: number;
  total: number;
}

export interface BudgetCalculationResult {
  breakdown: CostBreakdown;
  materials: MaterialCost[];
  marketRates: MarketRate;
}