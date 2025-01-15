import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, RefreshCw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export function MaterialOrdersDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: orders, refetch } = useQuery({
    queryKey: ['material-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('material_orders')
        .select(`
          *,
          material_suppliers (name),
          material_order_tracking (
            status,
            tracking_number,
            carrier,
            estimated_delivery
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleRefreshPrices = async () => {
    setIsRefreshing(true);
    try {
      await supabase.functions.invoke('fetch-material-prices', {
        body: { refresh_all: true }
      });
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Material Orders</h2>
        <Button 
          onClick={handleRefreshPrices}
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Prices
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {orders?.filter(o => o.status === 'pending').length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              In Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {orders?.filter(o => o.status === 'shipped').length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatPrice(
                orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Estimated Delivery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.material_suppliers?.name}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.material_order_tracking?.[0]?.tracking_number || 'N/A'}
                  </TableCell>
                  <TableCell>{formatPrice(order.total_amount || 0)}</TableCell>
                  <TableCell>
                    {order.material_order_tracking?.[0]?.estimated_delivery
                      ? new Date(order.material_order_tracking[0].estimated_delivery).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}