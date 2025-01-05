import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkflow } from "../WorkflowContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function ContractSetupStage({ projectId }: { projectId: string }) {
  const { state, dispatch } = useWorkflow();
  const { toast } = useToast();

  const handleCreateContract = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      // Transition to client review stage
      dispatch({ type: "SET_STAGE", payload: "client_review" });
      
      toast({
        title: "Contract Created",
        description: "Please review the contract terms",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create contract",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contract Setup</h2>
      <p className="text-muted-foreground mb-4">
        To begin the project, we need to create and sign a contract.
      </p>
      <Button
        onClick={handleCreateContract}
        disabled={state.isLoading}
      >
        {state.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Contract
      </Button>
    </Card>
  );
}