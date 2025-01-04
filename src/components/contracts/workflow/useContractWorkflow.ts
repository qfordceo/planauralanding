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

  const signContractMutation = useMutation({
    mutationFn: async () => {
      const { data: userResponse } = await supabase.auth.getUser();
      const isClient = contract?.project.user_id === userResponse.user?.id;
      
      const updates = {
        ...(isClient ? {
          workflow_stage: "contractor_review",
          client_signature_data: { signed_at: new Date().toISOString() },
          signed_by_client_at: new Date().toISOString()
        } : {
          workflow_stage: "completed",
          contractor_signature_data: { signed_at: new Date().toISOString() },
          signed_by_contractor_at: new Date().toISOString(),
          status: "signed"
        })
      };

      const { data, error } = await supabase
        .from("project_contracts")
        .update(updates)
        .eq("id", contract?.id)
        .select()
        .single();

      if (error) throw error;

      if (isClient) {
        await supabase.functions.invoke("send-contract-email", {
          body: {
            contractId: contract.id,
            recipientId: data.contractor_id,
            notificationType: "review"
          },
        });
      } else {
        await supabase.functions.invoke("send-contract-email", {
          body: {
            contractId: contract.id,
            recipientId: contract.project.user_id,
            notificationType: "completed"
          },
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-contract"] });
      toast({
        title: "Contract Signed",
        description: "The contract has been successfully signed",
      });
    },
  });

  return {
    contract,
    isLoading,
    createContract: createContractMutation.mutate,
    signContract: signContractMutation.mutate,
    isSigningContract: signContractMutation.isPending,
    isCreatingContract: createContractMutation.isPending
  };
}