import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PerformanceStatsProps {
  contractorId: string;
}

export function PerformanceStats({ contractorId }: PerformanceStatsProps) {
  const { data: stats } = useQuery({
    queryKey: ['performance-stats', contractorId],
    queryFn: async () => {
      const { data: contractor } = await supabase
        .from('contractors')
        .select('average_rating')
        .eq('id', contractorId)
        .single();

      const { count: totalProjects } = await supabase
        .from('contractor_projects')
        .select('*', { count: 'exact', head: true })
        .eq('contractor_id', contractorId);

      const { count: completedProjects } = await supabase
        .from('contractor_projects')
        .select('*', { count: 'exact', head: true })
        .eq('contractor_id', contractorId)
        .eq('status', 'completed');

      return {
        rating: contractor?.average_rating || 0,
        completionRate: totalProjects ? (completedProjects / totalProjects) * 100 : 0,
        totalProjects: totalProjects || 0,
        completedProjects: completedProjects || 0
      };
    }
  });

  return (
    <Card className="p-4 space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-2">Average Rating</h4>
        <div className="text-2xl font-bold">{stats?.rating.toFixed(1)} / 5.0</div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Project Completion Rate</h4>
        <Progress value={stats?.completionRate} className="h-2" />
        <p className="text-sm text-muted-foreground mt-1">
          {stats?.completedProjects} of {stats?.totalProjects} projects completed
        </p>
      </div>
    </Card>
  );
}