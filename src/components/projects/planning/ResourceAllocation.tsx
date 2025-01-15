import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Users } from "lucide-react";
import { format } from "date-fns";

interface ResourceAllocationProps {
  projectId: string;
}

export function ResourceAllocation({ projectId }: ResourceAllocationProps) {
  const { data: allocations, isLoading } = useQuery({
    queryKey: ['resource-allocations', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_allocations')
        .select(`
          *,
          profiles (
            email
          )
        `)
        .eq('project_id', projectId);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading resource allocations...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resource Allocation</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {allocations?.map((allocation) => (
              <Card key={allocation.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <div>
                      <h3 className="font-medium">{allocation.profiles.email}</h3>
                      <p className="text-sm text-muted-foreground">{allocation.role}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{allocation.allocation_percentage}%</span>
                    <p className="text-muted-foreground">
                      {format(new Date(allocation.start_date), 'MMM d')} - 
                      {format(new Date(allocation.end_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}