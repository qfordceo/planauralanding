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
import { useToast } from "@/hooks/use-toast";

interface ContractWorkflowManagerProps {
  projectId: string;
}

export function ContractWorkflowManager({ projectId }: ContractWorkflowManagerProps) {
  const { toast } = useToast();

  const { data: contract, isLoading } = useQuery({
    queryKey: ['project-contract', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_contracts')
        .select(`
          *,
          project:project_id (
            title,
            description,
            user_id
          )
        `)
        .eq('project_id', projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const activateProjectPortal = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'active' })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Project Portal Activated",
        description: "You can now access all project features",
      });
    } catch (error) {
      console.error('Error activating project portal:', error);
      toast({
        title: "Error",
        description: "Failed to activate project portal",
        variant: "destructive",
      });
    }
  };

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

  // If contract is signed and completed, show project details
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
          onComplete={async () => {
            await activateProjectPortal();
            window.location.reload();
          }}
        />
      </div>
    </ContractWorkflowProvider>
  );
}