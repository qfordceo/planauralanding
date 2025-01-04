import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MaterialsListProps } from "./types";
import { MaterialItem } from "@/types/materials";

export function MaterialsList({ materialCategories, onSelectionComplete }: MaterialsListProps) {
  const { toast } = useToast();
  const [selectedMaterials, setSelectedMaterials] = useLocalStorage<Record<string, MaterialItem>>('selected-materials', {});

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

    const hasSelectionsInAllCategories = materialCategories.every(category =>
      category.items.some(item => 
        selectedMaterials[`${category.name}-${item.name}`]?.selectedProduct
      )
    );

    if (hasSelectionsInAllCategories && onSelectionComplete) {
      onSelectionComplete();
    }
  };

  return (
    <div className="space-y-6">
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
  );
}
