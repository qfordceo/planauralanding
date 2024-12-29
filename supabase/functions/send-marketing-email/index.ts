import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailCampaign {
  contractorId: string;
  subject: string;
  html: string;
  recipients: string[];
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contractorId, subject, html, recipients } = await req.json() as EmailCampaign;

    // Verify contractor exists and get their business name
    const { data: contractor, error: contractorError } = await supabase
      .from("contractors")
      .select("business_name")
      .eq("id", contractorId)
      .single();

    if (contractorError || !contractor) {
      throw new Error("Contractor not found");
    }

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${contractor.business_name} <onboarding@resend.dev>`,
        to: recipients,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    const data = await res.json();

    // Log the campaign in the database
    await supabase.from("contractor_marketing").insert({
      contractor_id: contractorId,
      title: subject,
      content: html,
      type: "Email Campaign",
      status: "sent",
      platform: "Email",
      metrics: { recipients_count: recipients.length },
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-marketing-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);