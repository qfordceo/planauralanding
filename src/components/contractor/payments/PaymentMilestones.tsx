import { useState } from "react";
import { Loader2 } from "lucide-react";
import { MilestoneForm } from "./MilestoneForm";
import { MilestoneList } from "./MilestoneList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePaymentMilestones } from "./hooks/usePaymentMilestones";

interface PaymentMilestonesProps {
  contractorId: string;
  projectId: string;
}

export function PaymentMilestones({ contractorId, projectId }: PaymentMilestonesProps) {
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const { 
    milestones, 
    isLoading, 
    addMilestone, 
    updateMilestoneStatus, 
    deleteMilestone 
  } = usePaymentMilestones(contractorId, projectId);

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

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
          onSubmit={(data) => {
            addMilestone.mutate(data);
            setIsAddingMilestone(false);
          }}
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