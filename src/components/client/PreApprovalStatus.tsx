import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface PreApprovalStatusProps {
  profile: any;
}

export function PreApprovalStatus({ profile }: PreApprovalStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const startPreApproval = () => {
    // Will be implemented when API is ready
    console.log("Starting pre-approval process");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-Approval Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {profile?.preapproval_status ? (
          <>
            <div className="space-y-2">
              <p>Current Status: 
                <span className={`ml-2 font-semibold capitalize ${getStatusColor(profile.preapproval_status)}`}>
                  {profile.preapproval_status}
                </span>
              </p>
              {profile.preapproval_amount && (
                <p>Pre-Approved Amount: 
                  <span className="ml-2 font-semibold">
                    {formatPrice(profile.preapproval_amount)}
                  </span>
                </p>
              )}
            </div>
            {profile.preapproval_status === 'rejected' && (
              <Button onClick={startPreApproval}>
                Start New Pre-Approval
              </Button>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <p>Start your construction loan pre-approval process today!</p>
            <Button onClick={startPreApproval}>
              Start Pre-Approval
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}