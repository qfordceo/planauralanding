import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { TimelineItem } from "./TimelineItem";

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
  tasks?: Task[] | null;
}

export function ProjectTimeline({ projectId, tasks: initialTasks }: ProjectTimelineProps) {
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
    initialData: initialTasks,
    enabled: !initialTasks
  });

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
              <TimelineItem 
                key={task.id} 
                task={task} 
                isLast={index === (tasks.length - 1)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}