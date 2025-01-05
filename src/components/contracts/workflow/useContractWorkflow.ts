import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useContractWorkflow(projectId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contract, isLoading } = useQuery({
    queryKey: ["project-contract", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_contracts")
        .select(`
          *,
          project:project_id (
            title,
            description,
            user_id
          )
        `)
        .eq("project_id", projectId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const createContractMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("project_contracts")
        .insert([
          {
            project_id: projectId,
            contract_type: "construction",
            status: "draft",
            workflow_stage: "client_review",
            content: {
              terms: "Standard construction contract terms...",
              scope: "Full home construction as per approved plans...",
              payment_schedule: "As per milestone completion...",
            },
            workflow_metadata: {},
            validation_status: {},
            stage_history: [{
              stage: "setup",
              timestamp: new Date().toISOString(),
              actor_id: (await supabase.auth.getUser()).data.user?.id
            }]
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await supabase.functions.invoke("send-contract-email", {
        body: {
          contractId: data.id,
          recipientId: data.project.user_id,
          notificationType: "review"
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-contract"] });
      toast({
        title: "Contract Created",
        description: "Please review the contract terms",
      });
    },
  });

  const updateWorkflowStageMutation = useMutation({
    mutationFn: async (newStage: string) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("project_contracts")
        .update({
          workflow_stage: newStage,
          stage_history: [
            ...(contract?.stage_history || []),
            {
              stage: newStage,
              timestamp: new Date().toISOString(),
              actor_id: user.data.user?.id
            }
          ]
        })
        .eq("id", contract?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-contract"] });
      toast({
        title: "Workflow Updated",
        description: "Contract stage has been updated successfully",
      });
    },
  });

  const validateStageMutation = useMutation({
    mutationFn: async (validationData: Record<string, boolean>) => {
      const { data, error } = await supabase
        .from("project_contracts")
        .update({
          validation_status: {
            ...(contract?.validation_status || {}),
            ...validationData
          }
        })
        .eq("id", contract?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-contract"] });
    },
  });

  return {
    contract,
    isLoading,
    createContract: createContractMutation.mutate,
    updateWorkflowStage: updateWorkflowStageMutation.mutate,
    validateStage: validateStageMutation.mutate,
    isUpdatingStage: updateWorkflowStageMutation.isPending,
    isValidating: validateStageMutation.isPending,
    isCreatingContract: createContractMutation.isPending
  };
}