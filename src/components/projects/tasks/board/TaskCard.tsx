import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { TaskCardProps } from "./types";
import { cn } from "@/lib/utils";

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      land_preparation: 'bg-green-100 text-green-800',
      permits_and_approvals: 'bg-blue-100 text-blue-800',
      utilities: 'bg-purple-100 text-purple-800',
      foundation: 'bg-orange-100 text-orange-800',
      framing: 'bg-yellow-100 text-yellow-800',
      plumbing: 'bg-cyan-100 text-cyan-800',
      electrical: 'bg-red-100 text-red-800',
      hvac: 'bg-indigo-100 text-indigo-800',
      roofing: 'bg-pink-100 text-pink-800',
      exterior: 'bg-teal-100 text-teal-800',
      interior: 'bg-violet-100 text-violet-800',
      landscaping: 'bg-emerald-100 text-emerald-800',
      inspections: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        "p-3 mb-2 cursor-move hover:shadow-md transition-shadow",
        isDragging && "opacity-50"
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm">{task.title}</h4>
          {task.inspection_required && (
            <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className={getCategoryColor(task.category)}>
            {task.category.replace('_', ' ')}
          </Badge>
          
          {task.inspection_status && (
            <Badge variant="outline">
              {task.inspection_status}
            </Badge>
          )}
        </div>

        {task.due_date && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(task.due_date), 'MMM d, yyyy')}
          </div>
        )}
      </div>
    </Card>
  );
}