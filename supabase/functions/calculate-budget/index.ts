import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customizations, floorPlanId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get floor plan details
    const { data: floorPlan, error: floorPlanError } = await supabase
      .from('floor_plans')
      .select('*')
      .eq('id', floorPlanId)
      .single();

    if (floorPlanError) throw floorPlanError;

    // Calculate base cost
    const baseCost = floorPlan.build_price_per_sqft * floorPlan.square_feet;

    // Get customization details
    const { data: customizationOptions, error: customizationError } = await supabase
      .from('customization_options')
      .select('*')
      .in('id', customizations.map(c => c.customization_id));

    if (customizationError) throw customizationError;

    // Calculate total customization cost
    const customizationCost = customizations.reduce((total, customization) => {
      const option = customizationOptions.find(opt => opt.id === customization.customization_id);
      if (!option) return total;
      return total + (option.base_cost * (customization.quantity || 1));
    }, 0);

    // Get AI recommendations using OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides budget recommendations for home customizations.'
          },
          {
            role: 'user',
            content: `Analyze these customizations and provide cost-saving recommendations:
              Floor Plan: ${floorPlan.square_feet} sq ft
              Base Cost: $${baseCost}
              Customizations: ${JSON.stringify(customizationOptions)}
              Total Additional Cost: $${customizationCost}`
          }
        ]
      })
    });

    const aiData = await openAIResponse.json();
    const recommendations = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({
        baseCost,
        customizationCost,
        totalCost: baseCost + customizationCost,
        recommendations
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in calculate-budget function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});