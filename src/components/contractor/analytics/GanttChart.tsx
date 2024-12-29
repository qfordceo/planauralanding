import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

interface GanttChartProps {
  contractorId: string;
}

export function GanttChart({ contractorId }: GanttChartProps) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['contractor-projects', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_projects')
        .select('*')
        .eq('contractor_id', contractorId)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const chartData = projects?.map(project => ({
    name: project.title,
    start: new Date(project.start_date).getTime(),
    duration: project.end_date 
      ? new Date(project.end_date).getTime() - new Date(project.start_date).getTime()
      : 0,
    status: project.status
  })) || [];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => format(value, 'MM/dd/yyyy')}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
            />
            <Tooltip
              labelFormatter={(value) => format(value, 'MM/dd/yyyy')}
              formatter={(value: any) => [
                format(value, 'MM/dd/yyyy'),
                'Date'
              ]}
            />
            <Bar
              dataKey="duration"
              fill="#8884d8"
              background={{ fill: '#eee' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}