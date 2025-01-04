import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectContract, ContractVersion } from "@/types/contracts";
import { useToast } from "@/hooks/use-toast";

export function useContractVersioning(contractId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contract, isLoading } = useQuery({
    queryKey: ['contract', contractId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_contracts')
        .select('*')
        .eq('id', contractId)
        .single();

      if (error) throw error;
      return data as ProjectContract;
    }
  });

  const createVersion = useMutation({
    mutationFn: async (newContent: any) => {
      const newVersion: ContractVersion = {
        version: (contract?.version_history?.length || 0) + 1,
        content: newContent,
        timestamp: new Date().toISOString(),
        author_id: (await supabase.auth.getUser()).data.user?.id || '',
      };

      const { data, error } = await supabase
        .from('project_contracts')
        .update({
          content: newContent,
          version_history: [...(contract?.version_history || []), newVersion],
        })
        .eq('id', contractId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract'] });
      toast({
        title: "Version Created",
        description: "A new version of the contract has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create new version. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    contract,
    isLoading,
    createVersion: createVersion.mutate,
    isCreatingVersion: createVersion.isPending
  };
}