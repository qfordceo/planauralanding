import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
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
            <p className="text-xs text-muted-foreground">
              Created {formatDistanceToNow(new Date(project.created_at))} ago
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}