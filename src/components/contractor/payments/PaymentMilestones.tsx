import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MilestoneForm } from "./MilestoneForm";
import { MilestoneList } from "./MilestoneList";

interface PaymentMilestonesProps {
  contractorId: string;
  projectId: string;
}

export function PaymentMilestones({ contractorId, projectId }: PaymentMilestonesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  const { data: milestones, isLoading } = useQuery({
    queryKey: ["contractor-milestones", contractorId, projectId],
    queryFn: async () => {
      // Only fetch if we have a valid projectId (not empty and not "test-project-id")
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
    enabled: Boolean(projectId && projectId !== "test-project-id"), // Only run query if we have a valid projectId
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
      setIsAddingMilestone(false);
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

  // Show loading state
  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  // If no project is selected, show a message
  if (!projectId || projectId === "test-project-id") {
    return <p className="text-muted-foreground">Please select a project to manage payment milestones.</p>;
  }

  return (
    <div className="space-y-6">
      {!isAddingMilestone && (
        <Button onClick={() => setIsAddingMilestone(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Milestone
        </Button>
      )}

      {isAddingMilestone && (
        <MilestoneForm
          onSubmit={(data) => addMilestone.mutate(data)}
          onCancel={() => setIsAddingMilestone(false)}
        />
      )}

      <MilestoneList
        milestones={milestones || []}
        onStatusUpdate={updateMilestoneStatus.mutate}
        onDelete={(id) => deleteMilestone.mutate(id)}
      />
    </div>
  );
}