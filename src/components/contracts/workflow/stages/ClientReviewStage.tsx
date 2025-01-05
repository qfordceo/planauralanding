import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContractTerms } from "../../ContractTerms";
import { useWorkflow } from "../WorkflowContext";
import { useToast } from "@/hooks/use-toast";

export function ClientReviewStage({ projectId }: { projectId: string }) {
  const { state, dispatch } = useWorkflow();
  const { toast } = useToast();

  const handleReviewComplete = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      // Transition to next stage
      dispatch({ type: "SET_STAGE", payload: "contractor_review" });
      
      toast({
        title: "Review Complete",
        description: "Contract has been sent for contractor review",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete review",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Client Review</h2>
      <div className="space-y-6">
        <ContractTerms />
        <Button onClick={handleReviewComplete}>
          Complete Review
        </Button>
      </div>
    </Card>
  );
}