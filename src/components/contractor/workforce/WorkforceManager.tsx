import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkerDirectory } from "./WorkerDirectory";
import { TaskAssignments } from "./TaskAssignments";
import { TimeTracking } from "./TimeTracking";

interface WorkforceManagerProps {
  contractorId: string;
}

export function WorkforceManager({ contractorId }: WorkforceManagerProps) {
  return (
    <Tabs defaultValue="directory" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="directory">Directory</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="time">Time Tracking</TabsTrigger>
      </TabsList>
      <TabsContent value="directory">
        <WorkerDirectory contractorId={contractorId} />
      </TabsContent>
      <TabsContent value="tasks">
        <TaskAssignments contractorId={contractorId} />
      </TabsContent>
      <TabsContent value="time">
        <TimeTracking contractorId={contractorId} />
      </TabsContent>
    </Tabs>
  );
}