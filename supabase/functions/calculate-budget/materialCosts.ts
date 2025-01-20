import { createClient } from '@supabase/supabase-js';
import { MaterialCost } from './types';

export async function getMaterialCosts(supabase: ReturnType<typeof createClient>): Promise<MaterialCost[]> {
  const { data, error } = await supabase
    .from('material_price_updates')
    .select(`
      id,
      material:build_materials(
        name,
        quantity,
        unit
      ),
      price
    `)
    .order('last_updated', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching material costs:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.material.name,
    quantity: item.material.quantity,
    unit: item.material.unit,
    price_per_unit: item.price
  }));
}