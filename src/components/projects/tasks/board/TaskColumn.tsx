import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./TaskCard";
import { TaskColumnProps } from "./types";

export function TaskColumn({
  title,
  status,
  tasks,
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-2"
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
            <TaskCard 
              key={task.id} 
              task={task}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}