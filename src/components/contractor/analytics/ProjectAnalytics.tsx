import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectMetrics } from "./ProjectMetrics";
import { TimelineView } from "./TimelineView";
import { PerformanceStats } from "./PerformanceStats";

interface ProjectAnalyticsProps {
  contractorId: string;
}

export function ProjectAnalytics({ contractorId }: ProjectAnalyticsProps) {
  return (
    <Tabs defaultValue="metrics" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>
      <TabsContent value="metrics">
        <ProjectMetrics contractorId={contractorId} />
      </TabsContent>
      <TabsContent value="timeline">
        <TimelineView contractorId={contractorId} />
      </TabsContent>
      <TabsContent value="performance">
        <PerformanceStats contractorId={contractorId} />
      </TabsContent>
    </Tabs>
  );
}