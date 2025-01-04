import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

interface ContractSigningStatusProps {
  contract: {
    signed_by_client_at: string | null;
    signed_by_contractor_at: string | null;
    workflow_stage: string;
  };
}

export function ContractSigningStatus({ contract }: ContractSigningStatusProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarClock className="w-5 h-5" />
          Signing Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Client Signature: {contract.signed_by_client_at 
              ? formatDate(contract.signed_by_client_at)
              : 'Pending'}
          </p>
          <p className="text-sm text-muted-foreground">
            Contractor Signature: {contract.signed_by_contractor_at 
              ? formatDate(contract.signed_by_contractor_at)
              : 'Pending'}
          </p>
          <p className="text-sm text-muted-foreground">
            Current Stage: {contract.workflow_stage.replace('_', ' ').toUpperCase()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}