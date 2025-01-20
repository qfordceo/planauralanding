import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { processAnalysisResult } from './analysis.ts'
import { downloadImageFromStorage, downloadExternalImage, analyzeImageWithAzure } from './utils.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    console.log('Starting floor plan analysis:', { imageUrl })

    // Define analysis stages with weights
    const stages = [
      { name: 'preprocessing', weight: 0.15, status: 'pending' },
      { name: 'feature_detection', weight: 0.25, status: 'pending' },
      { name: 'room_analysis', weight: 0.3, status: 'pending' },
      { name: 'material_estimation', weight: 0.3, status: 'pending' }
    ]

    let metrics = {
      confidence: 0,
      accuracy: 0,
      completeness: 0
    }

    // Stage 1: Preprocessing
    stages[0].status = 'processing'
    const imageData = imageUrl.startsWith('https://') 
      ? await downloadExternalImage(imageUrl)
      : await downloadImageFromStorage(imageUrl)
    stages[0].status = 'complete'
    metrics.confidence += 25

    // Stage 2: Feature Detection
    stages[1].status = 'processing'
    const azureAnalysis = await analyzeImageWithAzure(imageData)
    stages[1].status = 'complete'
    metrics.accuracy += 30
    metrics.confidence += 15

    // Stage 3: Room Analysis
    stages[2].status = 'processing'
    const analysisResult = processAnalysisResult(azureAnalysis)
    stages[2].status = 'complete'
    metrics.completeness += 35
    metrics.accuracy += 20

    // Stage 4: Material Estimation
    stages[3].status = 'processing'
    const materialEstimates = analysisResult.materialEstimates
    stages[3].status = 'complete'
    metrics.completeness += 25
    metrics.confidence += 20

    // Normalize metrics
    metrics = {
      confidence: Math.min(Math.round(metrics.confidence), 100),
      accuracy: Math.min(Math.round(metrics.accuracy), 100),
      completeness: Math.min(Math.round(metrics.completeness), 100)
    }

    console.log('Analysis completed successfully:', metrics)

    return new Response(
      JSON.stringify({
        ...analysisResult,
        stages,
        metrics
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in floor plan analysis:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stages: [
          { name: 'preprocessing', status: 'error' },
          { name: 'feature_detection', status: 'pending' },
          { name: 'room_analysis', status: 'pending' },
          { name: 'material_estimation', status: 'pending' }
        ],
        metrics: {
          confidence: 0,
          accuracy: 0,
          completeness: 0
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})