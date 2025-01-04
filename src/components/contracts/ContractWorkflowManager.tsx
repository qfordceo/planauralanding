import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractWorkflowProvider } from "./workflow/ContractWorkflowContext";
import { ContractStageIndicator } from "./workflow/ContractStageIndicator";
import { ContractSigningStatus } from "./workflow/ContractSigningStatus";
import { ContractWorkflow } from "./ContractWorkflow";
import { ProjectDetails } from "../projects/ProjectDetails";
import { useToast } from "@/hooks/use-toast";
import { WorkflowErrorBoundary } from "./workflow/ErrorBoundary";
import { LoadingOverlay } from "./workflow/LoadingOverlay";
import { ContractSetupState } from "./workflow/ContractSetupState";
import { useWorkflowValidation } from "./workflow/useWorkflowValidation";

interface ContractWorkflowManagerProps {
  projectId: string;
}

export function ContractWorkflowManager({ projectId }: ContractWorkflowManagerProps) {
  const { toast } = useToast();
  const { validateStageTransition, errors } = useWorkflowValidation();

  const { data: contract, isLoading, error } = useQuery({
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
        description: "Failed to activate project portal. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (error) {
    throw error;
  }

  return (
    <WorkflowErrorBoundary>
      <div className="relative space-y-6">
        {isLoading && <LoadingOverlay />}
        
        {!isLoading && !contract && <ContractSetupState />}

        {!isLoading && contract && (
          <ContractWorkflowProvider>
            {errors.length > 0 && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                {errors.map((error, index) => (
                  <p key={index}>{error.message}</p>
                ))}
              </div>
            )}

            {contract.status === "signed" && contract.workflow_stage === "completed" ? (
              <ProjectDetails projectId={projectId} />
            ) : (
              <>
                <ContractStageIndicator currentStage={contract.workflow_stage} />
                <ContractSigningStatus contract={contract} />
                <ContractWorkflow
                  projectId={projectId}
                  onComplete={async () => {
                    try {
                      if (validateStageTransition(contract.workflow_stage, 'completed')) {
                        await activateProjectPortal();
                        window.location.reload();
                      }
                    } catch (error) {
                      console.error('Error completing workflow:', error);
                      toast({
                        title: "Error",
                        description: "Failed to complete the contract workflow",
                        variant: "destructive",
                      });
                    }
                  }}
                />
              </>
            )}
          </ContractWorkflowProvider>
        )}
      </div>
    </WorkflowErrorBoundary>
  );
}