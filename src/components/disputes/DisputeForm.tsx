import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DisputeFormProps {
  projectId: string;
}

export function DisputeForm({ projectId }: DisputeFormProps) {
  const [description, setDescription] = useState("");
  const [disputeType, setDisputeType] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDisputeMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('project_disputes')
        .insert({
          project_id: projectId,
          description,
          status: 'open',
          mediation_status: 'not_required',
          raised_by_id: user.id,
          resolution_type: disputeType
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setDescription("");
      setDisputeType("");
      queryClient.invalidateQueries({ queryKey: ['disputes', projectId] });
      toast({
        title: "Dispute submitted successfully",
        description: "A mediator will review your case shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Error submitting dispute",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="space-y-4">
      <Select
        value={disputeType}
        onValueChange={setDisputeType}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select dispute type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="timeline">Timeline Dispute</SelectItem>
          <SelectItem value="quality">Quality Issue</SelectItem>
          <SelectItem value="communication">Communication Problem</SelectItem>
          <SelectItem value="payment">Payment Dispute</SelectItem>
          <SelectItem value="scope">Scope of Work</SelectItem>
        </SelectContent>
      </Select>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your dispute in detail..."
        className="min-h-[100px]"
      />
      <Button 
        onClick={() => createDisputeMutation.mutate()}
        disabled={!description.trim() || !disputeType || createDisputeMutation.isPending}
        className="w-full"
      >
        {createDisputeMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Submit Dispute
      </Button>
    </div>
  );
}