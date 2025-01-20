import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';
import { getMarketRates } from './marketRates.ts';
import { getMaterialCosts } from './materialCosts.ts';
import { calculateTotalBudget } from './calculations.ts';
import type { BudgetInput, BudgetResult } from './types.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { floorPlanId, landListingId, customizations } = await req.json() as BudgetInput;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get market rates for the area
    const marketRates = await getMarketRates(supabase, landListingId);
    
    // Get material costs based on floor plan and customizations
    const materialCosts = await getMaterialCosts(supabase, floorPlanId, customizations);

    // Calculate total budget
    const budget = calculateTotalBudget(marketRates, materialCosts);

    return new Response(
      JSON.stringify(budget),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error calculating budget:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});