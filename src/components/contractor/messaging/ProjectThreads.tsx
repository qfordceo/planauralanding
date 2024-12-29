import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectThreadsProps {
  contractorId: string;
  selectedProject: string | null;
  onSelectProject: (projectId: string | null) => void;
}

export function ProjectThreads({
  contractorId,
  selectedProject,
  onSelectProject,
}: ProjectThreadsProps) {
  const { data: projects } = useQuery({
    queryKey: ['contractor-projects', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_projects')
        .select('id, title')
        .eq('contractor_id', contractorId);

      if (error) throw error;
      return data;
    }
  });

  return (
    <Select
      value={selectedProject || ""}
      onValueChange={(value) => onSelectProject(value || null)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="All Projects" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Projects</SelectItem>
        {projects?.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}