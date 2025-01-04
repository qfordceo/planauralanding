import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractWorkflowProvider } from "./workflow/ContractWorkflowContext";
import { ContractStageIndicator } from "./workflow/ContractStageIndicator";
import { ContractSigningStatus } from "./workflow/ContractSigningStatus";
import { ContractWorkflow } from "./ContractWorkflow";
import { ProjectDetails } from "../projects/ProjectDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ContractWorkflowManagerProps {
  projectId: string;
}

export function ContractWorkflowManager({ projectId }: ContractWorkflowManagerProps) {
  const { data: contract, isLoading } = useQuery({
    queryKey: ['project-contract', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_contracts')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) throw error;
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

  if (!contract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract Setup Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">No contract has been created for this project yet.</p>
        </CardContent>
      </Card>
    );
  }

  if (contract.status === "signed" && contract.workflow_stage === "completed") {
    return <ProjectDetails projectId={projectId} />;
  }

  return (
    <ContractWorkflowProvider>
      <div className="space-y-6">
        <ContractStageIndicator currentStage={contract.workflow_stage} />
        <ContractSigningStatus contract={contract} />
        <ContractWorkflow
          projectId={projectId}
          onComplete={() => window.location.reload()}
        />
      </div>
    </ContractWorkflowProvider>
  );
}