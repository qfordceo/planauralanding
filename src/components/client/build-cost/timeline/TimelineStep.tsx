import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MilestoneUpdate } from "@/components/milestones/MilestoneUpdate";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface TimelineStepProps {
  step: {
    id: string;
    title: string;
    status: string;
    description: string;
    contractor_submitted?: boolean;
    client_approved?: boolean;
    photos?: string[];
    stage?: string;
    due_date?: string;
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

  const getStageColor = (stage?: string) => {
    switch (stage) {
      case 'planning':
        return 'bg-purple-100 text-purple-800';
      case 'foundation':
        return 'bg-blue-100 text-blue-800';
      case 'construction':
        return 'bg-orange-100 text-orange-800';
      case 'finishing':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-6 top-10 h-full w-0.5 bg-gray-200" />
      )}
      <Card className="mb-4 p-4">
        <div className="flex gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background shadow">
            {getStatusIcon(step.status)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className={getStageColor(step.stage)}>
                    {step.stage || 'No Stage'}
                  </Badge>
                  {step.due_date && (
                    <Badge variant="outline" className="bg-gray-100">
                      Due: {new Date(step.due_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
              {step.contractor_submitted && !step.client_approved && (
                <Button size="sm" onClick={() => onApprove(step.id)}>
                  Approve Milestone
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
            
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
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMilestone(step.id)}
                >
                  Add Update
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(`/documents/${step.id}`, '_blank')}
                >
                  <FileText className="h-4 w-4" />
                  View Documents
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}