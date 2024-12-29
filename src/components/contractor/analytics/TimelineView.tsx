import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimelineViewProps {
  contractorId: string;
}

export function TimelineView({ contractorId }: TimelineViewProps) {
  const { data: projects } = useQuery({
    queryKey: ['project-timeline', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_projects')
        .select('title, start_date, end_date, status')
        .eq('contractor_id', contractorId)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {projects?.map((project, index) => (
            <div key={index} className="border-l-2 border-primary pl-4 pb-4">
              <h4 className="font-medium">{project.title}</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(project.start_date).toLocaleDateString()} - 
                {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'}
              </p>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                {project.status}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}