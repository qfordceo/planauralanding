import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DefectTrackerProps {
  contractorId: string;
}

export function DefectTracker({ contractorId }: DefectTrackerProps) {
  const { toast } = useToast();
  const { data: defects, isLoading, refetch } = useQuery({
    queryKey: ['inspection-defects', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_inspection_defects')
        .select(`
          *,
          project:project_id(title)
        `)
        .eq('contractor_id', contractorId)
        .order('inspection_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const markAsResolved = async (defectId: string) => {
    const { error } = await supabase
      .from('contractor_inspection_defects')
      .update({ resolved: true })
      .eq('id', defectId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark defect as resolved",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Defect marked as resolved",
      });
      refetch();
    }
  };

  if (isLoading) return <div>Loading defects...</div>;

  return (
    <div className="space-y-4">
      {defects?.map((defect) => (
        <div key={defect.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Project: {defect.project?.title}</h3>
            <span className="text-sm text-muted-foreground">
              {new Date(defect.inspection_date).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm mb-4">{defect.defect_description}</p>
          {defect.resolved ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Resolved</span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => markAsResolved(defect.id)}
            >
              Mark as Resolved
            </Button>
          )}
        </div>
      ))}
      {!defects?.length && (
        <p className="text-center text-muted-foreground">
          No inspection defects found.
        </p>
      )}
    </div>
  );
}