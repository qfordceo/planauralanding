import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractWorkflowManager } from "@/components/contracts/ContractWorkflowManager";
import { ContractCreation } from "./ContractCreation";
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
    <ContractCreation
      projectId={projectId}
      acceptedBid={acceptedBid}
      onContractCreated={() => setContractCreated(true)}
    />
  );
}