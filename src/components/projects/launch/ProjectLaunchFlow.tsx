import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ContractWorkflowManager } from "@/components/contracts/ContractWorkflowManager";
import { Loader2 } from "lucide-react";

interface ProjectLaunchFlowProps {
  projectId: string;
  acceptedBid: {
    id: string;
    contractor_id: string;
    bid_amount: number;
  };
}

export function ProjectLaunchFlow({ projectId, acceptedBid }: ProjectLaunchFlowProps) {
  const [contractCreated, setContractCreated] = useState(false);
  const { toast } = useToast();

  const { data: existingContract, isLoading: checkingContract } = useQuery({
    queryKey: ['project-contract', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_contracts')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const createInitialContract = async () => {
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

    if (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error",
        description: "Failed to create contract. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setContractCreated(true);
    toast({
      title: "Success",
      description: "Contract created successfully. Please review and sign.",
    });
  };

  useEffect(() => {
    if (existingContract) {
      setContractCreated(true);
    }
  }, [existingContract]);

  if (checkingContract) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (contractCreated) {
    return <ContractWorkflowManager projectId={projectId} />;
  }

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
        <Button onClick={createInitialContract}>
          Create Contract
        </Button>
      </CardContent>
    </Card>
  );
}