import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarDays, CheckCircle2, Clock } from "lucide-react";

interface TimelineSummaryProps {
  projectId: string;
}

export function TimelineSummary({ projectId }: TimelineSummaryProps) {
  const { data: summary } = useQuery({
    queryKey: ['timeline-summary', projectId],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from('project_tasks')
        .select('status, start_date, due_date')
        .eq('project_id', projectId);

      if (error) throw error;

      const total = tasks?.length || 0;
      const completed = tasks?.filter(t => t.status === 'completed').length || 0;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      const dates = tasks
        ?.map(t => t.due_date)
        .filter(Boolean)
        .sort() as string[];
      
      const projectEnd = dates?.[dates.length - 1];

      return {
        totalTasks: total,
        completedTasks: completed,
        progress,
        projectEnd
      };
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-sm font-medium">Completed Tasks</div>
              <div className="text-2xl font-bold">
                {summary?.completedTasks}/{summary?.totalTasks}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium">Overall Progress</div>
              <div className="mt-1">
                <Progress value={summary?.progress} className="h-2" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium">Project End Date</div>
              <div className="text-lg font-medium">
                {summary?.projectEnd ? (
                  format(new Date(summary.projectEnd), 'MMM d, yyyy')
                ) : (
                  'Not set'
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}