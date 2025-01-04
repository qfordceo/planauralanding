import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatus } from "../types";
import { TaskCard } from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

interface TaskBoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: any[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function TaskBoardColumn({
  title,
  status,
  tasks,
  onDragOver,
  onDrop,
}: TaskBoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-2"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Card className="bg-muted">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            {title}
            <span className="bg-background text-muted-foreground rounded-full px-2 py-1 text-xs">
              {tasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}