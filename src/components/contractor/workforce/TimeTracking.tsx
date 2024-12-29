import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TimeTrackingProps {
  contractorId: string;
}

export function TimeTracking({ contractorId }: TimeTrackingProps) {
  const { data: timeEntries } = useQuery({
    queryKey: ['time-tracking', contractorId],
    queryFn: async () => {
      // This would typically fetch from a time_entries table
      // For now, returning mock data
      return [
        { id: 1, worker: "John Doe", project: "Kitchen Remodel", hours: 6, target: 8 },
        { id: 2, worker: "Jane Smith", project: "Bathroom Renovation", hours: 4, target: 6 },
      ];
    }
  });

  return (
    <div className="space-y-4">
      {timeEntries?.map((entry) => (
        <Card key={entry.id} className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="font-semibold">{entry.worker}</h3>
              <span className="text-sm text-muted-foreground">{entry.project}</span>
            </div>
            <Progress value={(entry.hours / entry.target) * 100} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {entry.hours} hours of {entry.target} hours completed
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}