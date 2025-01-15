import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { useResourceAllocation } from "./hooks/useResourceAllocation";
import { Progress } from "@/components/ui/progress";

interface ResourceAllocationProps {
  projectId: string;
}

export function ResourceAllocation({ projectId }: ResourceAllocationProps) {
  const { allocations, isLoading, updateAllocation } = useResourceAllocation(projectId);

  // Fetch related milestones
  const { data: milestones } = useQuery({
    queryKey: ['project-milestones', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('build_estimate_id', projectId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading resource allocations...</div>;
  }

  const getStatusColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-100 text-green-800';
    if (percentage < 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Resource Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {allocations?.map((allocation) => (
              <Card key={allocation.resource_id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <h3 className="font-medium">{allocation.resource_email}</h3>
                        <p className="text-sm text-muted-foreground">{allocation.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(allocation.start_date), 'MMM d')} - 
                        {format(new Date(allocation.end_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Allocation</span>
                        <span>{allocation.allocation_percentage}%</span>
                      </div>
                      <Progress 
                        value={allocation.allocation_percentage} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${getStatusColor(allocation.allocation_percentage)}`}>
                    {allocation.allocation_percentage}% Allocated
                  </div>
                </div>

                {milestones?.filter(m => 
                  new Date(m.due_date) >= new Date(allocation.start_date) &&
                  new Date(m.due_date) <= new Date(allocation.end_date)
                ).map(milestone => (
                  <div key={milestone.id} className="mt-2 p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{milestone.title}</span>
                      <span className="text-muted-foreground">
                        (Due: {format(new Date(milestone.due_date), 'MMM d')})
                      </span>
                    </div>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}