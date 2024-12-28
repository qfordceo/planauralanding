import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface PaymentHistoryProps {
  contractorId: string;
}

export function PaymentHistory({ contractorId }: PaymentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p>Payment history will be available once payment processing is set up next week.</p>
        </div>
      </CardContent>
    </Card>
  );
}