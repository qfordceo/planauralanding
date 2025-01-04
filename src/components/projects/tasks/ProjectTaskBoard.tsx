import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";
import { NewTaskDialog } from "./NewTaskDialog";
import { useState } from "react";

interface ProjectTaskBoardProps {
  projectId: string;
}

type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'needs_review' | 'completed';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  category: string;
  inspection_required: boolean;
  inspection_status: string | null;
  due_date: string | null;
}

const statusColumns: { status: TaskStatus; label: string }[] = [
  { status: 'not_started', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'blocked', label: 'Blocked' },
  { status: 'needs_review', label: 'Needs Review' },
  { status: 'completed', label: 'Completed' }
];

export function ProjectTaskBoard({ projectId }: ProjectTaskBoardProps) {
  const [showNewTask, setShowNewTask] = useState(false);
  const { toast } = useToast();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          id,
          title,
          description,
          status,
          category,
          inspection_required,
          inspection_status,
          due_date
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          title: "Error loading tasks",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Task[];
    },
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    const { error } = await supabase
      .from('project_tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Tasks</CardTitle>
        <Button onClick={() => setShowNewTask(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-5 gap-4">
            {statusColumns.map(({ status, label }) => (
              <TaskColumn
                key={status}
                title={label}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                {tasks
                  ?.filter((task) => task.status === status)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    />
                  ))}
              </TaskColumn>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <NewTaskDialog
        open={showNewTask}
        onOpenChange={setShowNewTask}
        projectId={projectId}
      />
    </Card>
  );
}