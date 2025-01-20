import { createClient } from '@supabase/supabase-js';
import { MarketRate } from './types';

export async function getMarketRates(location: string, supabase: ReturnType<typeof createClient>): Promise<MarketRate> {
  const { data, error } = await supabase
    .from('market_rate_adjustments')
    .select('*')
    .eq('location', location)
    .single();

  if (error) {
    console.error('Error fetching market rates:', error);
    return {
      location,
      labor_multiplier: 1.0,
      material_multiplier: 1.0,
      overhead_multiplier: 1.0
    };
  }

  return data;
}