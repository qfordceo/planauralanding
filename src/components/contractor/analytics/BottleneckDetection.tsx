import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock, TrendingDown } from "lucide-react";

interface BottleneckDetectionProps {
  contractorId: string;
}

export function BottleneckDetection({ contractorId }: BottleneckDetectionProps) {
  const { data: bottlenecks } = useQuery({
    queryKey: ['contractor-bottlenecks', contractorId],
    queryFn: async () => {
      const { data: projects, error } = await supabase
        .from('contractor_projects')
        .select(`
          *,
          project_milestones (*)
        `)
        .eq('contractor_id', contractorId)
        .eq('status', 'in_progress');
      
      if (error) throw error;

      // Analyze projects for bottlenecks
      const bottlenecks = projects?.map(project => {
        const delays = project.project_milestones?.filter(
          (milestone: any) => new Date(milestone.due_date) < new Date() && 
          milestone.status !== 'completed'
        );

        return {
          projectId: project.id,
          projectTitle: project.title,
          delayedMilestones: delays,
          severity: delays?.length || 0
        };
      }).filter(b => b.severity > 0);

      return bottlenecks;
    }
  });

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Project Bottlenecks</h3>
      
      {bottlenecks?.length === 0 ? (
        <Alert>
          <AlertTitle>No bottlenecks detected</AlertTitle>
          <AlertDescription>
            All projects are currently running on schedule.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {bottlenecks?.map((bottleneck) => (
            <Alert key={bottleneck.projectId} variant={
              bottleneck.severity > 2 ? "destructive" : "warning"
            }>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{bottleneck.projectTitle}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {bottleneck.delayedMilestones.length} delayed milestone(s)
                  </span>
                </div>
                {bottleneck.delayedMilestones.map((milestone: any) => (
                  <div key={milestone.id} className="mt-2 pl-6 text-sm">
                    • {milestone.title}
                  </div>
                ))}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </Card>
  );
}