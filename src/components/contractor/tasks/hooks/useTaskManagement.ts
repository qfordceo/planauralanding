import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTaskManagement(contractorId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['contractor-tasks', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('assigned_contractor_id', contractorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createTask = useMutation({
    mutationFn: async (taskData: { title: string; priority: string; status: string }) => {
      const { error } = await supabase
        .from('project_tasks')
        .insert([{ ...taskData, assigned_contractor_id: contractorId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-tasks'] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const markAsResolved = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('project_tasks')
        .update({ status: 'completed' })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-tasks'] });
      toast({
        title: "Success",
        description: "Task marked as completed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    },
  });

  return {
    tasks,
    isLoading,
    createTask: createTask.mutate,
    isCreating: createTask.isPending,
    markAsResolved: markAsResolved.mutate,
    isUpdating: markAsResolved.isPending
  };
}