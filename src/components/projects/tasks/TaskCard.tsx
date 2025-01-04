import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string;
  inspection_required: boolean;
  inspection_status: string | null;
  due_date: string | null;
}

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent) => void;
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  return (
    <Card
      draggable
      onDragStart={onDragStart}
      className="cursor-move hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm">{task.title}</h4>
          {task.inspection_required && (
            <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
          )}
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {task.category}
          </Badge>
          
          {task.due_date && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.due_date), 'MMM d')}
            </Badge>
          )}
          
          {task.inspection_required && task.inspection_status && (
            <Badge 
              variant={task.inspection_status === 'passed' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {task.inspection_status}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}