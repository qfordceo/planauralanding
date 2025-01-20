import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import type { MaterialCosts } from './types.ts';

export async function getMaterialCosts(
  supabase: SupabaseClient,
  floorPlanId: string,
  customizations?: Record<string, any>
): Promise<MaterialCosts> {
  // Get base material costs from floor plan
  const { data: floorPlan, error: floorPlanError } = await supabase
    .from('floor_plans')
    .select(`
      square_feet,
      build_price_per_sqft
    `)
    .eq('id', floorPlanId)
    .single();

  if (floorPlanError) throw floorPlanError;

  const baseMaterials = floorPlan.square_feet * floorPlan.build_price_per_sqft;

  // Calculate custom material costs if any customizations
  let customMaterials = 0;
  if (customizations) {
    const { data: options, error: optionsError } = await supabase
      .from('customization_options')
      .select('base_cost')
      .in('id', Object.keys(customizations));

    if (optionsError) throw optionsError;

    customMaterials = options.reduce((sum, option) => sum + option.base_cost, 0);
  }

  return {
    baseMaterials,
    customMaterials,
    wastageEstimate: 0.1 // 10% wastage estimate
  };
}