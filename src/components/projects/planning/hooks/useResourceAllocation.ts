import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function useResourceAllocation(projectId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch resource allocations with availability data
  const { data: allocations, isLoading } = useQuery({
    queryKey: ['resource-allocations', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_availability_view')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      return data;
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('resource-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resource_allocations',
          filter: `project_id=eq.${projectId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['resource-allocations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);

  const updateAllocation = useMutation({
    mutationFn: async ({ 
      resourceId, 
      allocationPercentage, 
      startDate, 
      endDate 
    }: {
      resourceId: string;
      allocationPercentage: number;
      startDate: Date;
      endDate: Date;
    }) => {
      const { error } = await supabase
        .from('resource_allocations')
        .update({
          allocation_percentage: allocationPercentage,
          start_date: startDate,
          end_date: endDate
        })
        .eq('id', resourceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-allocations'] });
      toast({
        title: "Resource allocation updated",
        description: "The resource allocation has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update resource allocation.",
        variant: "destructive",
      });
    },
  });

  return {
    allocations,
    isLoading,
    updateAllocation: updateAllocation.mutate,
    isUpdating: updateAllocation.isPending
  };
}