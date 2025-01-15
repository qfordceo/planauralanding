import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Calendar } from "lucide-react";
import { format } from "date-fns";

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  order_index: number;
}

interface ProjectRoadmapProps {
  projectId: string;
}

export function ProjectRoadmap({ projectId }: ProjectRoadmapProps) {
  const { data: roadmap, isLoading } = useQuery({
    queryKey: ['project-roadmap', projectId],
    queryFn: async () => {
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('project_roadmaps')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (roadmapError) throw roadmapError;

      if (roadmapData) {
        const { data: phases, error: phasesError } = await supabase
          .from('roadmap_phases')
          .select('*')
          .eq('roadmap_id', roadmapData.id)
          .order('order_index', { ascending: true });

        if (phasesError) throw phasesError;
        return { ...roadmapData, phases };
      }
      return null;
    }
  });

  if (isLoading) {
    return <div>Loading roadmap...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Roadmap</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Phase
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {roadmap?.phases?.map((phase: RoadmapPhase) => (
              <Card key={phase.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {phase.start_date && format(new Date(phase.start_date), 'MMM d, yyyy')}
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