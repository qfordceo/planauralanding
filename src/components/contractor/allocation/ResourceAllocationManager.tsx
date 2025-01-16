import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

interface ResourceAllocation {
  resource_id: string;
  project_id: string;
  role: string;
  allocation_percentage: number;
  start_date: string;
  end_date: string;
  resource_email: string;
  contractor_id: string;
}

interface Milestone {
  id: string;
  title: string;
  due_date: string;
  status: string;
}

export function ResourceAllocationManager({ contractorId }: { contractorId: string }) {
  const { toast } = useToast();

  // Fetch resource allocations
  const { data: allocations, isLoading: isLoadingAllocations } = useQuery({
    queryKey: ['resource-allocations', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_availability_view')
        .select('*')
        .eq('contractor_id', contractorId);

      if (error) throw error;
      return data as ResourceAllocation[];
    },
  });

  // Fetch related milestones
  const { data: milestones } = useQuery({
    queryKey: ['project-milestones', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('assigned_contractor_id', contractorId);

      if (error) throw error;
      return data as Milestone[];
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('resource-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resource_allocations',
          filter: `contractor_id=eq.${contractorId}`
        },
        (payload) => {
          toast({
            title: "Resource Allocation Updated",
            description: "The resource allocation has been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contractorId, toast]);

  const getStatusColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-100 text-green-800';
    if (percentage < 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoadingAllocations) {
    return <div>Loading resource allocations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Resource Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {allocations?.map((allocation) => (
              <Card key={allocation.resource_id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="font-medium">{allocation.resource_email}</div>
                    <div className="text-sm text-muted-foreground">{allocation.role}</div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
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

                {/* Related Milestones */}
                {milestones?.filter(m => 
                  new Date(m.due_date) >= new Date(allocation.start_date) &&
                  new Date(m.due_date) <= new Date(allocation.end_date)
                ).map(milestone => (
                  <div key={milestone.id} className="mt-2 p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2 text-sm">
                      {milestone.status === 'completed' ? (
                        <div className="text-green-500">✓</div>
                      ) : new Date(milestone.due_date) < new Date() ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      <span>{milestone.title}</span>
                      <span className="text-muted-foreground">
                        (Due: {format(new Date(milestone.due_date), 'MMM d')})
                      </span>
                    </div>
                  </div>
                ))}
              </Card>
            ))}

            {(!allocations || allocations.length === 0) && (
              <div className="text-center text-muted-foreground">
                No resource allocations found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}