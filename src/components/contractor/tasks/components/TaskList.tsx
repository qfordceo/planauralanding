import { Button } from "@/components/ui/button";
import { Task } from "../types";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onComplete: (taskId: string) => void;
  isUpdating: boolean;
}

export function TaskList({ tasks, isLoading, onComplete, isUpdating }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-muted-foreground">
              Priority: {task.priority}
            </div>
          </div>
          <Button
            onClick={() => onComplete(task.id)}
            disabled={isUpdating}
            variant={task.status === 'completed' ? "ghost" : "default"}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : task.status === 'completed' ? (
              'Completed'
            ) : (
              'Mark Complete'
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}