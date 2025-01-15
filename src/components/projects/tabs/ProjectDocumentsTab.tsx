import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectDocumentsTabProps {
  projectId: string;
}

export function ProjectDocumentsTab({ projectId }: ProjectDocumentsTabProps) {
  const { data: documents } = useQuery({
    queryKey: ['project-documents', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_documents')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="text-lg font-semibold">Project Documents</h2>
      <ul className="space-y-2">
        {documents?.map((document) => (
          <li key={document.id}>
            <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {document.title}
            </a>
          </li>
        )) || <p>No documents available.</p>}
      </ul>
    </div>
  );
}
