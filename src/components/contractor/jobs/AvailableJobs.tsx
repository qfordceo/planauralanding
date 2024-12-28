import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AvailableJobsProps {
  contractorId: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
}

export function AvailableJobs({ contractorId }: AvailableJobsProps) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['available-projects', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No available jobs found at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="p-4">
          <h3 className="font-semibold mb-2">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
          )}
          <Button>Submit Bid</Button>
        </Card>
      ))}
    </div>
  );
}