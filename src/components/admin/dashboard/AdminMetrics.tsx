import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ChartBar, Users, DollarSign } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export function AdminMetrics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const [projectsResponse, usersResponse, financialsResponse] = await Promise.all([
        supabase.from('projects').select('count'),
        supabase.from('profiles').select('count'),
        supabase.from('floor_plan_purchases').select('purchase_amount')
      ]);

      if (projectsResponse.error) throw projectsResponse.error;
      if (usersResponse.error) throw usersResponse.error;
      if (financialsResponse.error) throw financialsResponse.error;

      const totalRevenue = financialsResponse.data.reduce(
        (sum, purchase) => sum + (purchase.purchase_amount || 0),
        0
      );

      return {
        totalProjects: projectsResponse.data[0]?.count || 0,
        totalUsers: usersResponse.data[0]?.count || 0,
        totalRevenue,
      };
    }
  });

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <ChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalProjects}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</div>
        </CardContent>
      </Card>
    </div>
  );
}