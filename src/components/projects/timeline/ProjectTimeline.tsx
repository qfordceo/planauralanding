import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  status: string;
  category: string;
  start_date: string | null;
  due_date: string | null;
  completed_date: string | null;
  inspection_required: boolean;
  inspection_status: string | null;
}

interface ProjectTimelineProps {
  projectId: string;
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          id,
          title,
          status,
          category,
          start_date,
          due_date,
          completed_date,
          inspection_required,
          inspection_status
        `)
        .eq('project_id', projectId)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'needs_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-8">
            {tasks?.map((task, index) => (
              <div key={task.id} className="relative">
                {index !== tasks.length - 1 && (
                  <div className="absolute left-6 top-10 h-full w-0.5 bg-gray-200" />
                )}
                <div className="flex gap-4">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background shadow">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{task.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        {task.inspection_required && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800">
                            Inspection Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {task.start_date && (
                        <span>Started: {format(new Date(task.start_date), 'PPP')}</span>
                      )}
                      {task.due_date && (
                        <span className="ml-4">Due: {format(new Date(task.due_date), 'PPP')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}