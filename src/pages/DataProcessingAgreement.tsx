import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function DataProcessingAgreement() {
  const { toast } = useToast();
  const lastUpdated = "March 13, 2024";

  const handleAcceptDPA = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('contractors')
        .update({ 
          dpa_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "DPA Accepted",
        description: "You have successfully accepted the Data Processing Agreement.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept the DPA. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <ScrollArea className="h-[80vh]">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Data Processing Agreement</h1>
                <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
              </div>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Parties</h2>
                <p>This Data Processing Agreement ("DPA") is between PlanAura ("Data Controller") and the Contractor ("Data Processor").</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Scope</h2>
                <p>This DPA applies to the processing of personal data by the Contractor when accessing and using the PlanAura dashboard and related services.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Obligations</h2>
                <h3 className="text-xl font-medium mb-2">3.1 Data Processor shall:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process personal data only on documented instructions from PlanAura</li>
                  <li>Ensure confidentiality of processed data</li>
                  <li>Implement appropriate security measures</li>
                  <li>Assist PlanAura in fulfilling data subject rights</li>
                  <li>Delete or return all personal data after service completion</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Security Measures</h2>
                <p>The Data Processor shall implement appropriate technical and organizational measures including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access controls and authentication</li>
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Staff training on data protection</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Breaches</h2>
                <p>The Data Processor shall notify PlanAura without undue delay after becoming aware of a personal data breach.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
                <p>Upon termination of services, the Data Processor shall delete or return all personal data as instructed by PlanAura.</p>
              </section>

              <div className="pt-6 flex justify-center">
                <Button onClick={handleAcceptDPA} className="w-full md:w-auto">
                  Accept Data Processing Agreement
                </Button>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
