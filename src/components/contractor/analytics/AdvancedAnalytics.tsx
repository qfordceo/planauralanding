import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GanttChart } from "./GanttChart";
import { BottleneckDetection } from "./BottleneckDetection";
import { PerformanceMetrics } from "./PerformanceMetrics";

interface AdvancedAnalyticsProps {
  contractorId: string;
}

export function AdvancedAnalytics({ contractorId }: AdvancedAnalyticsProps) {
  return (
    <Tabs defaultValue="gantt" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="gantt">Project Timeline</TabsTrigger>
        <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
        <TabsTrigger value="metrics">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="gantt" className="space-y-4">
        <GanttChart contractorId={contractorId} />
      </TabsContent>

      <TabsContent value="bottlenecks" className="space-y-4">
        <BottleneckDetection contractorId={contractorId} />
      </TabsContent>

      <TabsContent value="metrics" className="space-y-4">
        <PerformanceMetrics contractorId={contractorId} />
      </TabsContent>
    </Tabs>
  );
}