import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ContractCreationProps {
  projectId: string;
  acceptedBid: {
    id: string;
    contractor_id: string;
    bid_amount: number;
  };
  onContractCreated: () => void;
}

export function ContractCreation({ projectId, acceptedBid, onContractCreated }: ContractCreationProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createInitialContract = async () => {
    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('project_contracts')
        .insert([
          {
            project_id: projectId,
            contract_type: 'construction',
            status: 'draft',
            content: {
              bid_amount: acceptedBid.bid_amount,
              contractor_id: acceptedBid.contractor_id,
              terms: "Standard construction contract terms...",
              scope: "Full home construction as per approved plans...",
              payment_schedule: "As per milestone completion...",
            },
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract created successfully. Please review and sign.",
      });
      onContractCreated();
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error",
        description: "Failed to create contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Launch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm">
            A bid has been accepted for this project. The next step is to create and sign
            the construction contract.
          </p>
        </div>
        <Button onClick={createInitialContract} disabled={isCreating}>
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Contract
        </Button>
      </CardContent>
    </Card>
  );
}