import { useState } from "react";
import { Loader2 } from "lucide-react";
import { MilestoneForm } from "./MilestoneForm";
import { MilestoneList } from "./MilestoneList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePaymentMilestones } from "./hooks/usePaymentMilestones";
import { useToast } from "@/hooks/use-toast";

interface PaymentMilestonesProps {
  contractorId: string;
  projectId: string;
}

export function PaymentMilestones({ contractorId, projectId }: PaymentMilestonesProps) {
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const { toast } = useToast();
  
  const { 
    milestones, 
    isLoading, 
    addMilestone, 
    updateMilestoneStatus, 
    deleteMilestone,
    isValidating
  } = usePaymentMilestones(contractorId, projectId);

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  if (!projectId || projectId === "test-project-id") {
    return <p className="text-muted-foreground">Please select a project to manage payment milestones.</p>;
  }

  const handleAddMilestone = async (data: any) => {
    try {
      await addMilestone.mutateAsync(data);
      setIsAddingMilestone(false);
      toast({
        title: "Success",
        description: "Payment milestone added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment milestone",
        variant: "destructive",
      });
    }
  };

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
          onSubmit={handleAddMilestone}
          onCancel={() => setIsAddingMilestone(false)}
        />
      )}

      <MilestoneList
        milestones={milestones || []}
        onStatusUpdate={updateMilestoneStatus.mutate}
        onDelete={(id) => deleteMilestone.mutate(id)}
        isValidating={isValidating}
      />
    </div>
  );
}