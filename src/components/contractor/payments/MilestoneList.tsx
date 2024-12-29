import { Button } from "@/components/ui/button";
import { Calendar, Trash, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Milestone {
  id: string;
  title: string;
  amount: number;
  due_date: string;
  status: string;
  completed_date?: string;
}

interface MilestoneListProps {
  milestones: Milestone[];
  onStatusUpdate: (data: { id: string; status: string; completedDate?: string }) => void;
  onDelete: (id: string) => void;
}

export function MilestoneList({ milestones, onStatusUpdate, onDelete }: MilestoneListProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPp");
  };

  const handleStatusToggle = (milestone: Milestone) => {
    if (milestone.status === "completed") {
      onStatusUpdate({ id: milestone.id, status: "pending" });
    } else {
      onStatusUpdate({
        id: milestone.id,
        status: "completed",
        completedDate: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="p-4 border rounded-lg flex justify-between items-start"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{milestone.title}</h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                milestone.status === "completed" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {milestone.status}
              </span>
            </div>
            <p className="text-lg font-medium text-green-600">
              ${milestone.amount.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Due: {formatDate(milestone.due_date)}
            </p>
            {milestone.completed_date && (
              <p className="text-sm text-muted-foreground">
                Completed: {formatDate(milestone.completed_date)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStatusToggle(milestone)}
            >
              {milestone.status === "completed" ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(milestone.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}