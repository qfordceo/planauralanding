import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

interface MaterialsBreakdownProps {
  lineItemId: string;
  materials: any[];
}

export function MaterialsBreakdown({ lineItemId, materials }: MaterialsBreakdownProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMaterialSelect = async (materialId: string) => {
    // TODO: Implement material selection and product linking
    toast({
      title: "Coming Soon",
      description: "Material selection feature is under development",
    });
  };

  return (
    <div className="space-y-2">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Materials List
        </span>
        <ChevronRight className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </Button>

      {isExpanded && (
        <div className="pl-4 space-y-2">
          {materials.map((material) => (
            <div key={material.id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{material.name}</p>
                <p className="text-sm text-muted-foreground">Quantity: {material.quantity}</p>
              </div>
              <div className="text-right">
                <p>{formatPrice(material.estimated_cost)}</p>
                <Button 
                  variant="link" 
                  className="text-sm"
                  onClick={() => handleMaterialSelect(material.id)}
                >
                  Select Product
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}