import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskColumn } from "./TaskColumn";
import { NewTaskDialog } from "./NewTaskDialog";
import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { Task, TaskStatus } from "./types";

interface TaskBoardProps {
  projectId: string;
}

const statusColumns: { status: TaskStatus; label: string }[] = [
  { status: 'not_started', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'blocked', label: 'Blocked' },
  { status: 'needs_review', label: 'Needs Review' },
  { status: 'completed', label: 'Completed' }
];

export function TaskBoard({ projectId }: TaskBoardProps) {
  const [showNewTask, setShowNewTask] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
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

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, newStatus }: { taskId: string; newStatus: TaskStatus }) => {
      const { error } = await supabase
        .from('project_tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
      toast({
        title: "Task updated",
        description: "Task status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      
      updateTaskStatus.mutate({ taskId, newStatus });
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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-5 gap-4">
              {statusColumns.map(({ status, label }) => (
                <TaskColumn
                  key={status}
                  title={label}
                  status={status}
                  tasks={tasks?.filter((task) => task.status === status) || []}
                />
              ))}
            </div>
          </DndContext>
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