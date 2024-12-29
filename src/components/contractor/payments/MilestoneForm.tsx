import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MilestoneFormData } from "@/types/payments";
import { Plus, X } from "lucide-react";

interface MilestoneFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function MilestoneForm({ onSubmit, onCancel }: MilestoneFormProps) {
  const [milestone, setMilestone] = useState<MilestoneFormData>({
    title: "",
    amount: "",
    due_date: "",
    description: "",
    release_conditions: [],
  });

  const [newCondition, setNewCondition] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...milestone,
      amount: parseFloat(milestone.amount),
      status: "pending",
      escrow_status: "pending",
    });
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setMilestone({
        ...milestone,
        release_conditions: [...(milestone.release_conditions || []), newCondition.trim()],
      });
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    setMilestone({
      ...milestone,
      release_conditions: (milestone.release_conditions || []).filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <Input
        placeholder="Milestone Title"
        value={milestone.title}
        onChange={(e) => setMilestone({ ...milestone, title: e.target.value })}
        required
      />
      <Input
        type="number"
        placeholder="Amount"
        value={milestone.amount}
        onChange={(e) => setMilestone({ ...milestone, amount: e.target.value })}
        required
        min="0"
        step="0.01"
      />
      <Input
        type="datetime-local"
        value={milestone.due_date}
        onChange={(e) => setMilestone({ ...milestone, due_date: e.target.value })}
        required
      />
      <Textarea
        placeholder="Description"
        value={milestone.description}
        onChange={(e) => setMilestone({ ...milestone, description: e.target.value })}
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Release Conditions</label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a release condition"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
          />
          <Button type="button" onClick={addCondition} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {milestone.release_conditions?.map((condition, index) => (
          <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
            <span className="text-sm flex-1">{condition}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeCondition(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Milestone</Button>
      </div>
    </form>
  );
}