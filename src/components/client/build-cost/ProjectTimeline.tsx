import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Construction, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MilestoneUpdate } from "@/components/milestones/MilestoneUpdate";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TimelineStep {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending' | 'needs_review';
  description: string;
  contractor_submitted?: boolean;
  client_approved?: boolean;
  photos?: string[];
}

interface ProjectTimelineProps {
  projectId: string;
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
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

  if (isLoading) {
    return <div>Loading timeline...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Construction className="h-5 w-5" />
          Building Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones?.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                {getStatusIcon(step.status)}
                {index < (milestones.length - 1) && (
                  <div className="h-full w-0.5 bg-gray-200 my-2" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{step.title}</h4>
                  {step.contractor_submitted && !step.client_approved && (
                    <Button
                      size="sm"
                      onClick={() => approveMilestoneMutation.mutate(step.id)}
                    >
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}