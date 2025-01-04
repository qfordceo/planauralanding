import { format } from "date-fns";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  status: string;
  start_date: string | null;
  due_date: string | null;
  inspection_required: boolean;
  inspection_status: string | null;
}

interface TimelineItemProps {
  task: Task;
  isLast: boolean;
}

export function TimelineItem({ task, isLast }: TimelineItemProps) {
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

  return (
    <div className="relative">
      {!isLast && (
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
  );
}