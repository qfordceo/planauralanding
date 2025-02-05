import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskColumnProps {
  title: string;
  children: React.ReactNode;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function TaskColumn({ title, children, onDragOver, onDrop }: TaskColumnProps) {
  return (
    <div
      className="flex flex-col gap-2"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Card className="bg-muted">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}