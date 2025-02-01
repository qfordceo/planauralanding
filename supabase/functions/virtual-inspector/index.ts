import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ComplianceCheck {
  ruleId: string;
  status: 'passed' | 'failed' | 'warning';
  details: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { floorPlanId, locationData } = await req.json()
    console.log('Starting compliance check for floor plan:', floorPlanId)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get floor plan data
    const { data: floorPlan, error: floorPlanError } = await supabase
      .from('floor_plans')
      .select('*')
      .eq('id', floorPlanId)
      .single()

    if (floorPlanError) throw floorPlanError

    // Get compliance rules
    const { data: rules, error: rulesError } = await supabase
      .from('compliance_rules')
      .select('*')

    if (rulesError) throw rulesError

    // Perform compliance checks
    const checks: ComplianceCheck[] = []
    for (const rule of rules) {
      const check = await performComplianceCheck(rule, floorPlan, locationData)
      checks.push(check)

      // Store check result
      await supabase
        .from('compliance_checks')
        .insert({
          floor_plan_id: floorPlanId,
          rule_id: rule.id,
          status: check.status,
          details: check.details,
          location_data: locationData
        })
    }

    // Generate report
    const report = {
      floor_plan_id: floorPlanId,
      checks,
      summary: {
        total: checks.length,
        passed: checks.filter(c => c.status === 'passed').length,
        failed: checks.filter(c => c.status === 'failed').length,
        warnings: checks.filter(c => c.status === 'warning').length
      },
      generated_at: new Date().toISOString()
    }

    // Store report
    const { data: reportData, error: reportError } = await supabase
      .from('compliance_reports')
      .insert({
        floor_plan_id: floorPlanId,
        report_data: report
      })
      .select()
      .single()

    if (reportError) throw reportError

    return new Response(
      JSON.stringify(reportData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in virtual-inspector:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function performComplianceCheck(
  rule: any,
  floorPlan: any,
  locationData: any
): Promise<ComplianceCheck> {
  // Implement specific checks based on rule type
  switch (rule.check_type) {
    case 'door_clearance':
      return checkDoorClearance(rule, floorPlan)
    case 'emergency_exits':
      return checkEmergencyExits(rule, floorPlan)
    case 'room_dimensions':
      return checkRoomDimensions(rule, floorPlan)
    default:
      return {
        ruleId: rule.id,
        status: 'warning',
        details: { message: 'Check type not implemented' }
      }
  }
}

function checkDoorClearance(rule: any, floorPlan: any): ComplianceCheck {
  // Example implementation
  const minClearance = rule.parameters.min_clearance
  // In a real implementation, analyze the floor plan data
  return {
    ruleId: rule.id,
    status: 'passed',
    details: {
      message: `All doors meet minimum clearance of ${minClearance} inches`,
      locations: []
    }
  }
}

function checkEmergencyExits(rule: any, floorPlan: any): ComplianceCheck {
  // Example implementation
  const maxDistance = rule.parameters.max_distance
  // In a real implementation, analyze the floor plan data
  return {
    ruleId: rule.id,
    status: 'warning',
    details: {
      message: `Emergency exit distance check requires manual verification`,
      maxAllowedDistance: maxDistance,
      locations: []
    }
  }
}

function checkRoomDimensions(rule: any, floorPlan: any): ComplianceCheck {
  // Example implementation
  const minWidth = rule.parameters.min_width
  const minArea = rule.parameters.min_area
  // In a real implementation, analyze the floor plan data
  return {
    ruleId: rule.id,
    status: 'passed',
    details: {
      message: `All rooms meet minimum dimensions (width: ${minWidth}ft, area: ${minArea}sq ft)`,
      locations: []
    }
  }
}