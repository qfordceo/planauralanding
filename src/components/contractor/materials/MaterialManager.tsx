import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryTab } from "./InventoryTab";
import { OrdersTab } from "./OrdersTab";
import { SuppliersTab } from "./SuppliersTab";

interface MaterialManagerProps {
  contractorId: string;
}

export function MaterialManager({ contractorId }: MaterialManagerProps) {
  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">
        <InventoryTab contractorId={contractorId} />
      </TabsContent>
      <TabsContent value="orders">
        <OrdersTab contractorId={contractorId} />
      </TabsContent>
      <TabsContent value="suppliers">
        <SuppliersTab />
      </TabsContent>
    </Tabs>
  );
}