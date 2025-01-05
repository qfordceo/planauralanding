import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskManagement } from "./hooks/useTaskManagement";
import { TaskList } from "./components/TaskList";
import { TaskForm } from "./components/TaskForm";

interface TaskManagementProps {
  contractorId: string;
}

export function TaskManagement({ contractorId }: TaskManagementProps) {
  const { tasks, isLoading, markAsResolved, isUpdating } = useTaskManagement(contractorId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskForm contractorId={contractorId} />
        <TaskList
          tasks={tasks || []}
          isLoading={isLoading}
          onComplete={markAsResolved}
          isUpdating={isUpdating}
        />
      </CardContent>
    </Card>
  );
}