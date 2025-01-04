import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoanPrequalificationProps {
  onNext: () => void;
}

export function LoanPrequalification({ onNext }: LoanPrequalificationProps) {
  const { toast } = useToast();

  const startPreApproval = async () => {
    // Will be implemented when API is ready
    console.log("Starting pre-approval process");
    toast({
      title: "Pre-approval Started",
      description: "Your pre-approval process has been initiated.",
    });
    onNext();
  };

  const setCashBuyer = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({ 
          preapproval_status: 'cash',
          preapproval_amount: null 
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile has been updated as a cash buyer.",
      });
      onNext();
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          Start Your Journey
        </h3>
        <p className="text-muted-foreground">
          Begin with financing - choose your path
        </p>
      </div>

      <div className="space-y-4">
        <Button onClick={startPreApproval} className="w-full">
          Start Pre-Approval Process
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
    </div>
  );
}