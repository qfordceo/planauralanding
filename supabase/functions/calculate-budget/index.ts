import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customizations, floorPlanId, location } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAiKey = Deno.env.get('OPENAI_API_KEY')!;

    // Get floor plan and market data
    const response = await fetch(`${supabaseUrl}/rest/v1/floor_plans?id=eq.${floorPlanId}&select=*`, {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
      },
    });

    const [floorPlan] = await response.json();
    
    // Get AI analysis with enhanced context
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a construction and sustainability expert providing detailed cost analysis and recommendations.'
          },
          {
            role: 'user',
            content: `Analyze these customizations and provide detailed recommendations including sustainability impact:
              Location: ${location}
              Floor Plan: ${floorPlan.square_feet} sq ft
              Style: ${floorPlan.style}
              Customizations: ${JSON.stringify(customizations)}
              Consider: local material costs, energy efficiency, sustainability, and long-term value`
          }
        ]
      })
    });

    const aiData = await aiResponse.json();
    
    // Calculate costs with market adjustments
    const baseCost = floorPlan.build_price_per_sqft * floorPlan.square_feet;
    const customizationCost = calculateCustomizationCost(customizations, location);
    const sustainabilityImpact = calculateSustainabilityImpact(customizations);

    return new Response(
      JSON.stringify({
        baseCost,
        customizationCost,
        totalCost: baseCost + customizationCost,
        sustainabilityImpact,
        recommendations: aiData.choices[0].message.content,
        marketAnalysis: {
          localFactors: await getLocalMarketFactors(location),
          priceHistory: await getPriceHistory(location),
          futureProjections: await getFutureProjections(location)
        }
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

function calculateCustomizationCost(customizations: any[], location: string) {
  let totalCost = 0;
  const locationFactors = {
    'urban': 1.2,
    'suburban': 1.0,
    'rural': 0.9
  };
  
  const locationMultiplier = locationFactors[location as keyof typeof locationFactors] || 1.0;

  customizations.forEach(customization => {
    const baseCost = customization.quantity * customization.unitCost;
    const adjustedCost = baseCost * locationMultiplier;
    totalCost += adjustedCost;
  });

  return totalCost;
}

function calculateSustainabilityImpact(customizations: any[]) {
  const scores = {
    energyEfficiency: 0,
    waterConservation: 0,
    materialsSustainability: 0,
    carbonFootprint: 0
  };

  const impactFactors = {
    'solar_panels': { energyEfficiency: 8, carbonFootprint: -5 },
    'led_lighting': { energyEfficiency: 3, carbonFootprint: -2 },
    'smart_thermostat': { energyEfficiency: 4, carbonFootprint: -3 },
    'low_flow_fixtures': { waterConservation: 6 },
    'recycled_materials': { materialsSustainability: 7, carbonFootprint: -4 },
    'eco_insulation': { energyEfficiency: 6, carbonFootprint: -3 }
  };

  customizations.forEach(customization => {
    const impact = impactFactors[customization.type as keyof typeof impactFactors];
    if (impact) {
      Object.entries(impact).forEach(([key, value]) => {
        scores[key as keyof typeof scores] += value * customization.quantity;
      });
    }
  });

  return scores;
}

async function getLocalMarketFactors(location: string) {
  // Simulated market data - in production, this would call a real estate API
  const marketData = {
    urban: {
      laborCost: 1.2,
      materialCost: 1.15,
      demandFactor: 1.25,
      permitCost: 1.3
    },
    suburban: {
      laborCost: 1.0,
      materialCost: 1.0,
      demandFactor: 1.0,
      permitCost: 1.0
    },
    rural: {
      laborCost: 0.9,
      materialCost: 0.95,
      demandFactor: 0.8,
      permitCost: 0.7
    }
  };

  return marketData[location as keyof typeof marketData] || marketData.suburban;
}

async function getPriceHistory(location: string) {
  // Simulated historical data - would be replaced with real API calls
  const baseData = {
    '2020': 100,
    '2021': 105,
    '2022': 112,
    '2023': 118
  };

  const locationMultiplier = {
    urban: 1.2,
    suburban: 1.0,
    rural: 0.8
  }[location as keyof typeof locationMultiplier] || 1.0;

  return Object.entries(baseData).reduce((acc, [year, value]) => ({
    ...acc,
    [year]: value * locationMultiplier
  }), {});
}

async function getFutureProjections(location: string) {
  // Simulated projection data - would be replaced with ML model predictions
  const baseProjections = {
    oneYear: 1.05,
    threeYear: 1.15,
    fiveYear: 1.25,
    tenYear: 1.40
  };

  const locationRiskFactor = {
    urban: 1.1,
    suburban: 1.0,
    rural: 0.9
  }[location as keyof typeof locationRiskFactor] || 1.0;

  return Object.entries(baseProjections).reduce((acc, [term, multiplier]) => ({
    ...acc,
    [term]: multiplier * locationRiskFactor
  }), {});
}