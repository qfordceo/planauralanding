import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  base_cost: number;
  unit: string;
}

interface CustomizationListProps {
  options: CustomizationOption[];
  selectedCustomizations: Array<{
    customization_id: string;
    quantity: number;
  }>;
  onCustomizationChange: (customizationId: string, quantity: number) => void;
}

export function CustomizationList({
  options,
  selectedCustomizations,
  onCustomizationChange
}: CustomizationListProps) {
  return (
    <div className="space-y-4">
      {options.map((option) => {
        const selected = selectedCustomizations.find(
          c => c.customization_id === option.id
        );

        return (
          <div
            key={option.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h4 className="font-medium">{option.name}</h4>
              <p className="text-sm text-muted-foreground">{option.description}</p>
              <p className="text-sm">
                {formatPrice(option.base_cost)} per {option.unit}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                value={selected?.quantity || 0}
                onChange={(e) => onCustomizationChange(option.id, Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">{option.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}