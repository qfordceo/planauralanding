import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProjectMetricsProps {
  contractorId: string;
}

export function ProjectMetrics({ contractorId }: ProjectMetricsProps) {
  const { data: metrics } = useQuery({
    queryKey: ['project-metrics', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_projects')
        .select('status, budget, actual_cost')
        .eq('contractor_id', contractorId);
      
      if (error) throw error;
      return data;
    }
  });

  const projectData = metrics?.map(project => ({
    name: project.status,
    budget: project.budget || 0,
    actual: project.actual_cost || 0
  })) || [];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Project Cost Analysis</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual Cost" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}