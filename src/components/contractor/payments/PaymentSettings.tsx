import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface PaymentSettingsProps {
  contractorId: string;
}

export function PaymentSettings({ contractorId }: PaymentSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p>Payment processing setup will be available next week.</p>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Platform fees:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Plan Aura fee: 1.99%</li>
            <li>Payment processing: 2.9% + $0.30</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}