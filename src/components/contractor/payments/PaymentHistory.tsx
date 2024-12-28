import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { ContractorPayment } from "@/integrations/supabase/types/payments";

interface PaymentHistoryProps {
  contractorId: string;
}

export function PaymentHistory({ contractorId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<ContractorPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from('contractor_payments')
        .select('*')
        .eq('contractor_id', contractorId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPayments(data as ContractorPayment[]);
      }
      setLoading(false);
    };

    fetchPayments();
  }, [contractorId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <p>No payment history available.</p>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm capitalize">{payment.status}</p>
                  <p className="text-xs text-muted-foreground">
                    Fees: ${(payment.platform_fee + payment.processing_fee).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}