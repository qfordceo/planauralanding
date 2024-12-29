import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function SuppliersTab() {
  const { data: suppliers } = useQuery({
    queryKey: ['material-suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('material_suppliers')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {suppliers?.map((supplier) => (
        <Card key={supplier.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{supplier.name}</h3>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm">{supplier.rating?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {supplier.categories.map((category, index) => (
                <Badge key={index} variant="secondary">{category}</Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}