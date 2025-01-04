import { Flag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  getPriorityColor: (priority: string) => string;
}

export function TaskItem({ task, onComplete, getPriorityColor }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-2">
        <Flag className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
        <span>{task.title}</span>
      </div>
      <div className="flex items-center gap-2">
        {task.status === 'completed' ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onComplete(task.id)}
          >
            Mark Complete
          </Button>
        )}
      </div>
    </div>
  );
}