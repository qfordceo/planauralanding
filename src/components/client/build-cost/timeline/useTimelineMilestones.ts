import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTimelineMilestones(projectId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: milestones, isLoading } = useQuery({
    queryKey: ['project-milestones', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select(`
          id,
          title,
          description,
          status,
          contractor_submitted,
          client_approved,
          photos
        `)
        .eq('build_estimate_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const approveMilestoneMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      const { error } = await supabase
        .from('project_milestones')
        .update({
          client_approved: true,
          client_approval_date: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', milestoneId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-milestones'] });
      toast({
        title: "Milestone approved",
        description: "The milestone has been marked as completed.",
      });
    },
  });

  return {
    milestones,
    isLoading,
    approveMilestoneMutation
  };
}