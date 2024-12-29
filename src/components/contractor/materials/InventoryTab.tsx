import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface InventoryTabProps {
  contractorId: string;
}

export function InventoryTab({ contractorId }: InventoryTabProps) {
  const [search, setSearch] = useState("");

  const { data: inventory } = useQuery({
    queryKey: ['contractor-inventory', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_inventory')
        .select('*')
        .eq('contractor_id', contractorId);
      
      if (error) throw error;
      return data;
    }
  });

  const filteredInventory = inventory?.filter(item =>
    item.material_name.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button>Add Item</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.material_name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}