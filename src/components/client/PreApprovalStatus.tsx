import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PreApprovalStatusProps {
  profile: any;
}

export function PreApprovalStatus({ profile }: PreApprovalStatusProps) {
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      case 'cash':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const startPreApproval = () => {
    // Will be implemented when API is ready
    console.log("Starting pre-approval process");
  };

  const setCashBuyer = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          preapproval_status: 'cash',
          preapproval_amount: null 
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile has been updated as a cash buyer.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your status. Please try again.",
        variant: "destructive",
      });
    }
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
                  {profile.preapproval_status === 'cash' ? 'Cash Buyer' : profile.preapproval_status}
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
            {(profile.preapproval_status === 'rejected' || !profile.preapproval_status) && (
              <div className="space-y-4">
                <Button onClick={startPreApproval} className="w-full">
                  Start New Pre-Approval
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                <Button 
                  onClick={setCashBuyer} 
                  variant="outline"
                  className="w-full"
                >
                  I'm a Cash Buyer
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <p>Start your construction loan pre-approval process today!</p>
            <Button onClick={startPreApproval} className="w-full">
              Start Pre-Approval
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button 
              onClick={setCashBuyer} 
              variant="outline"
              className="w-full"
            >
              I'm a Cash Buyer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}