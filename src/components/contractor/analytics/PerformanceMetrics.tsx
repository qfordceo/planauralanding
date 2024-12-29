import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatPrice } from "@/lib/utils";

interface PerformanceMetricsProps {
  contractorId: string;
}

export function PerformanceMetrics({ contractorId }: PerformanceMetricsProps) {
  const { data: metrics } = useQuery({
    queryKey: ['contractor-performance', contractorId],
    queryFn: async () => {
      const { data: projects, error } = await supabase
        .from('contractor_projects')
        .select(`
          id,
          title,
          budget,
          actual_cost,
          start_date,
          end_date,
          status,
          contractor_reviews (rating)
        `)
        .eq('contractor_id', contractorId)
        .order('start_date', { ascending: true });
      
      if (error) throw error;

      return projects.map(project => ({
        name: project.title,
        budget: project.budget || 0,
        actual: project.actual_cost || 0,
        variance: project.budget && project.actual_cost 
          ? ((project.actual_cost - project.budget) / project.budget) * 100 
          : 0,
        rating: project.contractor_reviews?.[0]?.rating || 0
      }));
    }
  });

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Budget Performance</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                yAxisId="left"
                tickFormatter={formatPrice}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'variance' 
                    ? `${value.toFixed(1)}%` 
                    : formatPrice(value),
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="budget" 
                stroke="#8884d8" 
                name="Budget"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="actual" 
                stroke="#82ca9d"
                name="Actual"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="variance" 
                stroke="#ffc658"
                name="Variance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Project Ratings</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#8884d8"
                name="Rating"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}