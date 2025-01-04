import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { MaterialItem as MaterialItemType } from "./types";

interface MaterialItemProps {
  item: MaterialItemType;
  category: string;
  onSelectionComplete?: () => void;
}

export function MaterialItem({ item, category, onSelectionComplete }: MaterialItemProps) {
  const { toast } = useToast();
  const [selectedMaterials, setSelectedMaterials] = useLocalStorage<Record<string, MaterialItemType>>('selected-materials', {});
  const selectedKey = `${category}-${item.name}`;
  const isSelected = selectedMaterials[selectedKey]?.selectedProduct;

  const handleProductSelect = (product: any) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [selectedKey]: {
        ...item,
        selectedProduct: product
      }
    }));

    toast({
      title: "Product Selected",
      description: `${product.name} has been saved to your selections.`,
    });

    if (onSelectionComplete) {
      onSelectionComplete();
    }
  };

  return (
    <div className="p-4 border rounded-lg">
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
        onClick={() => handleProductSelect({
          name: "Sample Product",
          price: item.estimatedCost,
          url: "https://example.com"
        })}
      >
        {isSelected ? "Change Selection" : "Select Product"}
      </Button>
    </div>
  );
}