import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MilestoneUpdate } from "@/components/milestones/MilestoneUpdate";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface TimelineStepProps {
  step: {
    id: string;
    title: string;
    status: string;
    description: string;
    contractor_submitted?: boolean;
    client_approved?: boolean;
    photos?: string[];
  };
  isLast: boolean;
  onApprove: (milestoneId: string) => void;
}

export function TimelineStep({ step, isLast, onApprove }: TimelineStepProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'needs_review':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        {getStatusIcon(step.status)}
        {!isLast && <div className="h-full w-0.5 bg-gray-200 my-2" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{step.title}</h4>
          {step.contractor_submitted && !step.client_approved && (
            <Button size="sm" onClick={() => onApprove(step.id)}>
              Approve Milestone
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{step.description}</p>
        
        {step.photos && step.photos.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {step.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`Progress photo ${i + 1}`}
                className="h-24 w-24 object-cover rounded-md"
              />
            ))}
          </div>
        )}

        {selectedMilestone === step.id && (
          <div className="mt-4">
            <MilestoneUpdate
              milestoneId={step.id}
              onUpdateComplete={() => {
                setSelectedMilestone(null);
                queryClient.invalidateQueries({ queryKey: ['project-milestones'] });
              }}
            />
          </div>
        )}

        {step.status === 'in_progress' && selectedMilestone !== step.id && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setSelectedMilestone(step.id)}
          >
            Add Update
          </Button>
        )}
      </div>
    </div>
  );
}