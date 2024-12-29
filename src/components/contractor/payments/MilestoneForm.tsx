import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface MilestoneFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function MilestoneForm({ onSubmit, onCancel }: MilestoneFormProps) {
  const [milestone, setMilestone] = useState({
    title: "",
    amount: "",
    due_date: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...milestone,
      amount: parseFloat(milestone.amount),
      status: "pending",
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
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Milestone</Button>
      </div>
    </form>
  );
}