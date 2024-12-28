import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

interface MaterialCategory {
  name: string;
  items: MaterialItem[];
  estimatedCost: number;
}

interface MaterialItem {
  name: string;
  description: string;
  estimatedCost: number;
  unit: string;
  quantity: number;
  category: string;
  selectedProduct?: {
    name: string;
    price: number;
    url?: string;
  };
}

interface MaterialsCardProps {
  floorPlanId: string;
}

export function MaterialsCard({ floorPlanId }: MaterialsCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [materialCategories, setMaterialCategories] = useState<MaterialCategory[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useLocalStorage<Record<string, MaterialItem>>('selected-materials', {});
  
  const fetchMaterialSuggestions = async () => {
    setIsLoading(true);
    try {
      const { data: floorPlan } = await supabase
        .from('floor_plans')
        .select('*')
        .eq('id', floorPlanId)
        .single();

      if (!floorPlan) {
        throw new Error('Floor plan not found');
      }

      const response = await supabase.functions.invoke('suggest-materials', {
        body: { floorPlan }
      });

      if (response.error) throw response.error;
      
      setMaterialCategories(response.data.categories);
      
      toast({
        title: "Materials List Generated",
        description: "AI has generated a comprehensive list of required materials.",
      });
    } catch (error) {
      console.error('Error getting material suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate materials list. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (category: string, item: MaterialItem, product: any) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [`${category}-${item.name}`]: {
        ...item,
        selectedProduct: product
      }
    }));

    toast({
      title: "Product Selected",
      description: `${product.name} has been saved to your selections.`,
    });
  };

  const getTotalEstimatedCost = () => {
    return materialCategories.reduce((total, category) => 
      total + category.estimatedCost, 0
    );
  };

  const getTotalSelectedCost = () => {
    return Object.values(selectedMaterials).reduce((total, item) => 
      total + (item.selectedProduct?.price || 0) * item.quantity, 0
    );
  };

  useEffect(() => {
    if (floorPlanId) {
      fetchMaterialSuggestions();
    }
  }, [floorPlanId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Complete Materials List
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMaterialSuggestions}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Refresh List"
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Estimated Total Cost</p>
                <p className="text-2xl font-bold">{formatPrice(getTotalEstimatedCost())}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Selected Materials Cost</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(getTotalSelectedCost())}</p>
              </div>
            </div>

            {materialCategories.map((category) => (
              <div key={category.name} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    Estimated: {formatPrice(category.estimatedCost)}
                  </span>
                </div>
                <div className="grid gap-4">
                  {category.items.map((item) => {
                    const selectedKey = `${category.name}-${item.name}`;
                    const isSelected = selectedMaterials[selectedKey]?.selectedProduct;

                    return (
                      <div key={item.name} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <p className="text-sm">
                              Quantity: {item.quantity} {item.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Estimated: {formatPrice(item.estimatedCost)}</p>
                            {isSelected && (
                              <p className="text-sm text-primary">
                                Selected: {formatPrice(isSelected.price * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Placeholder for product selection - will be replaced with API integration */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleProductSelect(category.name, item, {
                            name: "Sample Product",
                            price: item.estimatedCost,
                            url: "https://example.com"
                          })}
                        >
                          {isSelected ? "Change Selection" : "Select Product"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}