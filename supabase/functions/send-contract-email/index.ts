import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  contractId: string;
  recipientId: string;
  notificationType: 'review' | 'signed' | 'completed';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contractId, recipientId, notificationType } = await req.json() as EmailRequest;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get recipient email and contract details
    const { data: recipient, error: recipientError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", recipientId)
      .single();

    if (recipientError || !recipient?.email) {
      throw new Error("Recipient not found");
    }

    const { data: contract, error: contractError } = await supabase
      .from("project_contracts")
      .select(`
        *,
        project:project_id (
          title,
          description
        )
      `)
      .eq("id", contractId)
      .single();

    if (contractError || !contract) {
      throw new Error("Contract not found");
    }

    // Prepare email content based on notification type
    let subject = "";
    let html = "";

    switch (notificationType) {
      case 'review':
        subject = `Contract Review Required: ${contract.project.title}`;
        html = `
          <h2>Contract Review Required</h2>
          <p>A new contract is ready for your review for project: ${contract.project.title}</p>
          <p>Please log in to your dashboard to review and sign the contract.</p>
        `;
        break;
      case 'signed':
        subject = `Contract Signed: ${contract.project.title}`;
        html = `
          <h2>Contract Has Been Signed</h2>
          <p>The contract for project ${contract.project.title} has been signed by another party.</p>
          <p>Please log in to your dashboard to review the signed contract.</p>
        `;
        break;
      case 'completed':
        subject = `Contract Completed: ${contract.project.title}`;
        html = `
          <h2>Contract Completion</h2>
          <p>The contract for project ${contract.project.title} has been fully executed.</p>
          <p>The project portal has been activated. You can now begin working on the project.</p>
        `;
        break;
    }

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Plan Aura <contracts@planaura.com>",
        to: [recipient.email],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    // Log notification in database
    const { error: notificationError } = await supabase
      .from("contract_signing_notifications")
      .insert([
        {
          contract_id: contractId,
          recipient_id: recipientId,
          notification_type: notificationType,
          email_status: 'sent',
          metadata: { subject, sent_to: recipient.email }
        }
      ]);

    if (notificationError) {
      console.error("Error logging notification:", notificationError);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-contract-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);