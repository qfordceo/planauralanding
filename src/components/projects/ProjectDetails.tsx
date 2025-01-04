import { Card } from "@/components/ui/card";
import { TaskBoard } from "./tasks/board/TaskBoard";

interface Task {
  id: string;
  title: string;
  status: string;
  category: string;
  start_date: string;
  due_date: string;
  completed_date: string;
  inspection_required: boolean;
  inspection_status: string | null;
}

export interface ProjectDetailsProps {
  projectId: string;
  tasks?: Task[];
}

export function ProjectDetails({ projectId, tasks }: ProjectDetailsProps) {
  return (
    <Card className="p-4">
      <TaskBoard projectId={projectId} />
    </Card>
  );
}