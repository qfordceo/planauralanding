import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractCreation } from "../ContractCreation";
import { Loader2 } from "lucide-react";

interface ContractSetupStageProps {
  projectId: string;
  acceptedBid: {
    id: string;
    contractor_id: string;
    bid_amount: number;
  };
  onContractCreated: () => void;
}

export function ContractSetupStage({ 
  projectId, 
  acceptedBid, 
  onContractCreated 
}: ContractSetupStageProps) {
  const { data: existingContract, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (existingContract) {
    return null;
  }

  return (
    <ContractCreation
      projectId={projectId}
      acceptedBid={acceptedBid}
      onContractCreated={onContractCreated}
    />
  );
}