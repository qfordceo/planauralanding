import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';
import { getMarketRates } from './marketRates.ts';
import { getMaterialCosts } from './materialCosts.ts';
import { calculateTotalCosts } from './calculations.ts';
import type { BudgetCalculationResult } from './types';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch data in parallel
    const [marketRates, materials] = await Promise.all([
      getMarketRates(location, supabaseClient),
      getMaterialCosts(supabaseClient)
    ]);

    // Calculate costs
    const breakdown = calculateTotalCosts(materials, marketRates);

    const result: BudgetCalculationResult = {
      breakdown,
      materials,
      marketRates
    };

    return new Response(
      JSON.stringify(result),
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