import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskBoardColumn } from "./TaskBoardColumn";
import { NewTaskDialog } from "../NewTaskDialog";
import { useState } from "react";
import { Task, TaskStatus } from "../types";

const statusColumns: { status: TaskStatus; label: string }[] = [
  { status: 'not_started', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'blocked', label: 'Blocked' },
  { status: 'needs_review', label: 'Needs Review' },
  { status: 'completed', label: 'Completed' }
];

interface TaskBoardProps {
  projectId: string;
}

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

      if (error) throw error;
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
    },
    onError: () => {
      toast({
        title: "Error updating task status",
        description: "There was an error updating the task status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      updateTaskStatus.mutate({
        taskId: active.id as string,
        newStatus: over.id as TaskStatus,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
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
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-5 gap-4">
            {statusColumns.map(({ status, label }) => (
              <TaskBoardColumn
                key={status}
                title={label}
                status={status}
                tasks={tasks?.filter((task) => task.status === status) || []}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
              />
            ))}
          </div>
        </DndContext>
      </CardContent>
      <NewTaskDialog
        open={showNewTask}
        onOpenChange={setShowNewTask}
        projectId={projectId}
      />
    </Card>
  );
}