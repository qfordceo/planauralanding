import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Contract } from "./types";

export function useContractData(projectId: string) {
  return useQuery({
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
}