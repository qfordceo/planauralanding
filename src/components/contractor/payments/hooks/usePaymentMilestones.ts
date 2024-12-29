import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function usePaymentMilestones(contractorId: string, projectId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: milestones, isLoading } = useQuery({
    queryKey: ["contractor-milestones", contractorId, projectId],
    queryFn: async () => {
      if (!projectId || projectId === "test-project-id") {
        return [];
      }

      const { data, error } = await supabase
        .from("contractor_payment_milestones")
        .select("*")
        .eq("contractor_id", contractorId)
        .eq("project_id", projectId)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: Boolean(projectId && projectId !== "test-project-id"),
  });

  const addMilestone = useMutation({
    mutationFn: async (milestoneData: any) => {
      const { error } = await supabase
        .from("contractor_payment_milestones")
        .insert([{
          ...milestoneData,
          contractor_id: contractorId,
          project_id: projectId,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-milestones"] });
      toast({
        title: "Success",
        description: "Payment milestone added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add payment milestone",
        variant: "destructive",
      });
      console.error("Error adding milestone:", error);
    },
  });

  const updateMilestoneStatus = useMutation({
    mutationFn: async ({ id, status, completedDate }: { id: string; status: string; completedDate?: string }) => {
      const { error } = await supabase
        .from("contractor_payment_milestones")
        .update({ 
          status,
          completed_date: completedDate,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-milestones"] });
      toast({
        title: "Success",
        description: "Milestone status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update milestone status",
        variant: "destructive",
      });
      console.error("Error updating milestone:", error);
    },
  });

  const deleteMilestone = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contractor_payment_milestones")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-milestones"] });
      toast({
        title: "Success",
        description: "Milestone deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      });
      console.error("Error deleting milestone:", error);
    },
  });

  return {
    milestones,
    isLoading,
    addMilestone,
    updateMilestoneStatus,
    deleteMilestone,
  };
}