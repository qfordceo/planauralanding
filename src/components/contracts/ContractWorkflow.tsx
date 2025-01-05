import React from "react";
import { ContractSteps } from "./workflow/ContractSteps";
import { ContractSigningStatus } from "./workflow/ContractSigningStatus";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContractWorkflowProps {
  projectId: string;
  onComplete: () => void;
}

export function ContractWorkflow({ projectId, onComplete }: ContractWorkflowProps) {
  const { data: contract } = useQuery({
    queryKey: ['contract', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_contracts')
        .select('*')
        .eq('project_id', projectId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      {contract && <ContractSigningStatus contract={contract} />}
      <ContractSteps projectId={projectId} onComplete={onComplete} />
    </div>
  );
}