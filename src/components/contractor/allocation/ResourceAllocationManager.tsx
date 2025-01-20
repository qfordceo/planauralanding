import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResourceAllocation } from "./useResourceAllocation";
import { AllocationCalendar } from "./AllocationCalendar";
import { ResourceAllocationManagerProps } from "./types";

export function ResourceAllocationManager({ contractorId }: ResourceAllocationManagerProps) {
  const { 
    resources, 
    events, 
    availability, 
    updateTaskAssignment 
  } = useResourceAllocation(contractorId);

  const handleEventDrop = async (info: any) => {
    const { event, resource } = info;
    
    try {
      await updateTaskAssignment.mutateAsync({
        taskId: event.id,
        contractorId: resource.id,
        startDate: event.start,
        endDate: event.end,
      });
    } catch (error) {
      info.revert();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <AllocationCalendar
          resources={resources}
          events={events}
          availability={availability}
          onEventDrop={handleEventDrop}
        />
      </CardContent>
    </Card>
  );
}