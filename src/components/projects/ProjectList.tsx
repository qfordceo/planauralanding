import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, X } from "lucide-react";
import { ProjectDetails } from "./ProjectDetails";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { data: tasks } = useQuery({
    queryKey: ['project-tasks', selectedProject],
    queryFn: async () => {
      if (!selectedProject) return null;
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          id,
          title,
          status,
          category,
          start_date,
          due_date,
          completed_date,
          inspection_required,
          inspection_status
        `)
        .eq('project_id', selectedProject)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedProject
  });

  if (selectedProject) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedProject(null)}
          className="mb-4"
        >
          <X className="h-4 w-4 mr-2" />
          Close Project
        </Button>
        <ProjectDetails projectId={selectedProject} tasks={tasks} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card 
          key={project.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedProject(project.id)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
            <Badge 
              variant={project.status === 'open' ? 'default' : 'secondary'}
            >
              {project.status}
            </Badge>
          </CardHeader>
          <CardContent>
            {project.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {project.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(new Date(project.created_at))} ago
              </p>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}