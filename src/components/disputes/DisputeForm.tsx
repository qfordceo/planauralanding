import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DisputeFormProps {
  projectId: string;
}

export function DisputeForm({ projectId }: DisputeFormProps) {
  const [newDispute, setNewDispute] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDisputeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('project_disputes')
        .insert({
          project_id: projectId,
          description: newDispute,
          status: 'open'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewDispute("");
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
      <Textarea
        value={newDispute}
        onChange={(e) => setNewDispute(e.target.value)}
        placeholder="Describe your dispute..."
        className="min-h-[100px]"
      />
      <Button 
        onClick={() => createDisputeMutation.mutate()}
        disabled={!newDispute.trim() || createDisputeMutation.isPending}
      >
        {createDisputeMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Submit Dispute
      </Button>
    </div>
  );
}