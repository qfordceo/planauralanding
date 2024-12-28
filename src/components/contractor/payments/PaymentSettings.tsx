import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentSettingsProps {
  contractorId: string;
}

export function PaymentSettings({ contractorId }: PaymentSettingsProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStripeConnect = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account', {
        body: { contractorId }
      });

      if (error) throw error;

      // Redirect to Stripe Connect onboarding
      window.location.href = data.url;
    } catch (error) {
      console.error('Error connecting to Stripe:', error);
      toast({
        title: "Error",
        description: "Failed to initialize Stripe Connect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Platform fees:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Plan Aura fee: 1.99%</li>
              <li>Payment processing: 2.9% + $0.30</li>
            </ul>
          </div>
          <Button onClick={handleStripeConnect} disabled={loading}>
            {loading ? "Setting up..." : "Set Up Payments"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}