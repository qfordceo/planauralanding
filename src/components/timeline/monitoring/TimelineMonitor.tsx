import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertTriangle, Clock } from "lucide-react";
import { DelayIndicator } from "./DelayIndicator";
import { ProgressTracker } from "./ProgressTracker";
import { MilestoneStatus } from "./MilestoneStatus";

interface TimelineMonitorProps {
  projectId: string;
}

export function TimelineMonitor({ projectId }: TimelineMonitorProps) {
  const { data: timelineData, isLoading } = useQuery({
    queryKey: ['project-timeline-monitor', projectId],
    queryFn: async () => {
      const { data: timeline, error: timelineError } = await supabase
        .from('timeline_agreements')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (timelineError) throw timelineError;

      const { data: milestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select(`
          id,
          title,
          description,
          due_date,
          status,
          completion_evidence
        `)
        .eq('build_estimate_id', projectId)
        .order('due_date', { ascending: true });

      if (milestonesError) throw milestonesError;

      return {
        timeline,
        milestones
      };
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!timelineData?.timeline) {
    return (
      <Alert>
        <AlertDescription>
          No timeline agreement found for this project.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ProgressTracker 
            milestones={timelineData.milestones} 
            agreedCompletionDate={timelineData.timeline.agreed_completion_date}
          />
          
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {timelineData.milestones?.map((milestone) => (
                <MilestoneStatus
                  key={milestone.id}
                  milestone={milestone}
                  projectId={projectId}
                />
              ))}
            </div>
          </ScrollArea>

          <DelayIndicator 
            milestones={timelineData.milestones}
            agreedCompletionDate={timelineData.timeline.agreed_completion_date}
          />
        </div>
      </CardContent>
    </Card>
  );
}