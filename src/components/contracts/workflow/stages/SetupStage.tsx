import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractSetup } from "../../steps/ContractSetup";
import { useWorkflow } from "../WorkflowContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SetupStageProps {
  projectId: string;
}

export function SetupStage({ projectId }: SetupStageProps) {
  const { dispatch } = useWorkflow();
  const { toast } = useToast();

  const { data: contract, isLoading } = useQuery({
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

  return (
    <ContractSetup
      isLoading={false}
      onCreateContract={async () => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          // Contract creation logic here
          dispatch({ type: 'SET_STAGE', payload: 'client_review' });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to create contract. Please try again.",
            variant: "destructive",
          });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }}
    />
  );
}