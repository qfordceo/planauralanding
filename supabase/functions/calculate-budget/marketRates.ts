import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import type { MarketRates } from './types.ts';

export async function getMarketRates(
  supabase: SupabaseClient,
  landListingId: string
): Promise<MarketRates> {
  const { data: listing, error: listingError } = await supabase
    .from('land_listings')
    .select('address')
    .eq('id', landListingId)
    .single();

  if (listingError) throw listingError;

  const { data: rates, error: ratesError } = await supabase
    .from('market_rate_adjustments')
    .select('labor_multiplier, material_multiplier')
    .eq('location', listing.address)
    .single();

  if (ratesError) throw ratesError;

  return {
    laborRate: rates.labor_multiplier,
    materialMultiplier: rates.material_multiplier,
    locationFactor: 1.0 // Default location factor
  };
}