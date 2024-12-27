import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { PreApprovalStatusDisplay } from "./PreApprovalStatusDisplay";
import { PreApprovalActions } from "./PreApprovalActions";

interface PreApprovalStatusProps {
  profile: Profile;
}

export const PreApprovalStatus: FC<PreApprovalStatusProps> = ({ profile }) => {
  const { toast } = useToast();

  const startPreApproval = async () => {
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
      console.error('Error setting cash buyer status:', error);
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
        {profile.preapproval_status ? (
          <>
            <PreApprovalStatusDisplay 
              status={profile.preapproval_status}
              amount={profile.preapproval_amount}
            />
            <PreApprovalActions
              status={profile.preapproval_status}
              onStartPreApproval={startPreApproval}
              onSetCashBuyer={setCashBuyer}
            />
          </>
        ) : (
          <div className="space-y-4">
            <p>Start your construction loan pre-approval process today!</p>
            <PreApprovalActions
              status={null}
              onStartPreApproval={startPreApproval}
              onSetCashBuyer={setCashBuyer}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
