import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WorkflowProvider, useWorkflow } from "./workflow/WorkflowContext";
import { SetupStage } from "./workflow/stages/SetupStage";
import { ContractReview } from "./steps/ContractReview";
import { ContractSignature } from "./ContractSignature";
import { useToast } from "@/hooks/use-toast";
import { LoadingOverlay } from "./workflow/LoadingOverlay";
import { ContractSetupState } from "./workflow/ContractSetupState";
import { useWorkflowValidation } from "./workflow/useWorkflowValidation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Contract } from "./workflow/types";

interface ContractWorkflowManagerProps {
  projectId: string;
}

function WorkflowContent({ projectId }: ContractWorkflowManagerProps) {
  const { state, dispatch } = useWorkflow();
  const { validateStageTransition } = useWorkflowValidation();
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
      return data as Contract;
    },
  });

  if (isLoading || state.isLoading) {
    return <LoadingOverlay />;
  }

  if (!contract) {
    return <ContractSetupState />;
  }

  const handleStageTransition = async (currentStage: string, nextStage: string) => {
    try {
      if (validateStageTransition(currentStage, nextStage)) {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const { error } = await supabase
          .from('project_contracts')
          .update({ workflow_stage: nextStage })
          .eq('id', contract.id);

        if (error) throw error;

        dispatch({ type: 'SET_STAGE', payload: nextStage as any });
        toast({
          title: "Success",
          description: "Contract stage updated successfully",
        });
      }
    } catch (error) {
      console.error('Error transitioning stage:', error);
      toast({
        title: "Error",
        description: "Failed to update contract stage",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const renderStageContent = () => {
    switch (state.currentStage) {
      case 'setup':
        return <SetupStage projectId={projectId} />;
      case 'client_review':
        return (
          <ContractReview
            onReviewComplete={() => handleStageTransition('client_review', 'contractor_review')}
          />
        );
      case 'contractor_review':
        return (
          <ContractReview
            onReviewComplete={() => handleStageTransition('contractor_review', 'completed')}
          />
        );
      case 'completed':
        return (
          <ContractSignature
            onSign={() => {
              dispatch({ type: 'SET_CONTRACT', payload: { ...contract, status: 'signed' } });
              window.location.reload();
            }}
          />
        );
      default:
        return <ContractSetupState />;
    }
  };

  return renderStageContent();
}

export function ContractWorkflowManager(props: ContractWorkflowManagerProps) {
  return (
    <ErrorBoundary>
      <WorkflowProvider>
        <WorkflowContent {...props} />
      </WorkflowProvider>
    </ErrorBoundary>
  );
}