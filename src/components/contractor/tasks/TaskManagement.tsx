import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import type { Task } from "./types";

export function TaskManagement({ contractorId }: { contractorId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['contractor-tasks', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('assigned_contractor_id', contractorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const createTask = useMutation({
    mutationFn: async (taskData: Partial<Task>) => {
      const { error } = await supabase
        .from('project_tasks')
        .insert([taskData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-tasks'] });
      toast({
        title: "Task created",
        description: "New task has been added successfully",
      });
      setNewTask("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Task['status'] }) => {
      const { error } = await supabase
        .from('project_tasks')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-tasks'] });
      toast({
        title: "Task updated",
        description: "Task status has been updated",
      });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskForm
          newTask={newTask}
          priority={priority}
          onTaskChange={setNewTask}
          onPriorityChange={setPriority}
          onSubmit={() =>
            createTask.mutate({
              title: newTask,
              priority,
              status: 'pending',
              assigned_contractor_id: contractorId,
            })
          }
        />

        <div className="space-y-4">
          {tasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={(id) =>
                updateTaskStatus.mutate({
                  id,
                  status: 'completed',
                })
              }
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}