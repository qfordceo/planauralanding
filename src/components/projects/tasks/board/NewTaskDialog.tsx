import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TaskCategory } from "./types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NewTaskDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTaskDialog({ projectId, open, onOpenChange }: NewTaskDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as TaskCategory,
    due_date: "",
    inspection_required: false,
  });

  const createTask = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('project_tasks')
        .insert([
          {
            project_id: projectId,
            ...data,
            status: 'not_started',
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        category: "" as TaskCategory,
        due_date: "",
        inspection_required: false,
      });
      toast({
        title: "Task created",
        description: "The task has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error creating task",
        description: "There was an error creating the task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value as TaskCategory })
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="land_preparation">Land Preparation</SelectItem>
              <SelectItem value="permits_and_approvals">Permits & Approvals</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="foundation">Foundation</SelectItem>
              <SelectItem value="framing">Framing</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="hvac">HVAC</SelectItem>
              <SelectItem value="roofing">Roofing</SelectItem>
              <SelectItem value="exterior">Exterior</SelectItem>
              <SelectItem value="interior">Interior</SelectItem>
              <SelectItem value="landscaping">Landscaping</SelectItem>
              <SelectItem value="inspections">Inspections</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="datetime-local"
            value={formData.due_date}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
            required
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="inspection"
              checked={formData.inspection_required}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, inspection_required: checked })
              }
            />
            <Label htmlFor="inspection">Requires Inspection</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}