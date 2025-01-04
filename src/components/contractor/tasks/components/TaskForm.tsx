import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface TaskFormProps {
  newTask: string;
  priority: "low" | "medium" | "high";
  onTaskChange: (value: string) => void;
  onPriorityChange: (value: "low" | "medium" | "high") => void;
  onSubmit: () => void;
}

export function TaskForm({
  newTask,
  priority,
  onTaskChange,
  onPriorityChange,
  onSubmit,
}: TaskFormProps) {
  return (
    <div className="flex gap-4 mb-6">
      <Input
        placeholder="New task title..."
        value={newTask}
        onChange={(e) => onTaskChange(e.target.value)}
        className="flex-1"
      />
      <Select
        value={priority}
        onValueChange={onPriorityChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low Priority</SelectItem>
          <SelectItem value="medium">Medium Priority</SelectItem>
          <SelectItem value="high">High Priority</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={onSubmit}
        disabled={!newTask}
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
}