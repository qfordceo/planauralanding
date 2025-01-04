import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface DisputeFormProps {
  projectId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

const DISPUTE_TYPES = [
  "timeline_delay",
  "quality_issues",
  "communication",
  "scope_changes",
  "payment",
  "other"
];

export function DisputeForm({ projectId, onSubmit, onCancel }: DisputeFormProps) {
  const [description, setDescription] = useState("");
  const [disputeType, setDisputeType] = useState<string>("");
  const { toast } = useToast();

  const createDisputeMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from('project_disputes')
        .insert({
          project_id: projectId,
          raised_by_id: user.id,
          description,
          status: 'open',
          mediation_status: 'not_required'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Dispute created",
        description: "Your dispute has been submitted successfully.",
      });
      onSubmit();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create dispute. Please try again.",
        variant: "destructive",
      });
    }
  });

  return (
    <Card className="p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createDisputeMutation.mutate();
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="type">Dispute Type</Label>
          <Select
            value={disputeType}
            onValueChange={setDisputeType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select dispute type" />
            </SelectTrigger>
            <SelectContent>
              {DISPUTE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace('_', ' ').charAt(0).toUpperCase() + 
                   type.replace('_', ' ').slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!description || !disputeType || createDisputeMutation.isPending}
          >
            Submit Dispute
          </Button>
        </div>
      </form>
    </Card>
  );
}