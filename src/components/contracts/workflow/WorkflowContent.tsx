import React from "react";
import { useWorkflow } from "./WorkflowContext";
import { useWorkflowValidation } from "./useWorkflowValidation";
import { SetupStage } from "./stages/SetupStage";
import { ContractReview } from "../steps/ContractReview";
import { ContractSignature } from "../ContractSignature";
import { ContractSetupState } from "./ContractSetupState";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkflowContentProps {
  projectId: string;
  contract: any;
}

export function WorkflowContent({ projectId, contract }: WorkflowContentProps) {
  const { state, dispatch } = useWorkflow();
  const { validateStageTransition } = useWorkflowValidation();
  const { toast } = useToast();

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
}

export default WorkflowContent;
