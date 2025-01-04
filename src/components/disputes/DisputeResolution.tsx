import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DisputeForm } from "./DisputeForm";
import { DisputeList } from "./DisputeList";

interface DisputeResolutionProps {
  projectId: string;
}

export function DisputeResolution({ projectId }: DisputeResolutionProps) {
  const { data: disputes, isLoading } = useQuery({
    queryKey: ['disputes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_disputes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispute Resolution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DisputeForm projectId={projectId} />
        {disputes && disputes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Active Disputes</h3>
            <DisputeList disputes={disputes} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}