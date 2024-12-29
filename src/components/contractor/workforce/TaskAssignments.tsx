import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskAssignmentsProps {
  contractorId: string;
}

export function TaskAssignments({ contractorId }: TaskAssignmentsProps) {
  const { data: tasks } = useQuery({
    queryKey: ['task-assignments', contractorId],
    queryFn: async () => {
      // This would typically fetch from a tasks table
      // For now, returning mock data
      return [
        { id: 1, title: "Install Kitchen Cabinets", assignee: "John Doe", status: "in-progress" },
        { id: 2, title: "Electrical Wiring Check", assignee: "Jane Smith", status: "pending" },
      ];
    }
  });

  return (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
            </div>
            <Badge variant={task.status === 'in-progress' ? 'secondary' : 'outline'}>
              {task.status}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}