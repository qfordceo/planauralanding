import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface OrdersTabProps {
  contractorId: string;
}

export function OrdersTab({ contractorId }: OrdersTabProps) {
  const { data: orders } = useQuery({
    queryKey: ['material-orders', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('material_orders')
        .select(`
          *,
          material_suppliers (
            name
          )
        `)
        .eq('contractor_id', contractorId);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Supplier</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Order Date</TableHead>
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
            <TableCell>${order.total_amount}</TableCell>
            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}