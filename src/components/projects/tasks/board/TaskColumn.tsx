import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskColumnProps } from "./types";
import { TaskCard } from "./TaskCard";

export function TaskColumn({
  title,
  status,
  tasks,
  onDragOver,
  onDrop,
}: TaskColumnProps) {
  return (
    <div
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
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={(e) => {
                e.dataTransfer.setData("taskId", task.id);
              }}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}