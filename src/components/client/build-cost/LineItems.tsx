import { formatPrice } from "@/lib/utils";
import { MaterialsBreakdown } from "./MaterialsBreakdown";

interface LineItem {
  id: string;
  description: string;
  actual_cost?: number;
  estimated_cost?: number;
  awarded_cost?: number;
  materials?: any[];
}

interface LineItemsProps {
  items: LineItem[];
}

export function LineItems({ items }: LineItemsProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <div className="flex justify-between items-start">
            <span className="font-medium">{item.description}</span>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Estimated: {formatPrice(item.estimated_cost || 0)}
              </div>
              {item.awarded_cost && (
                <div className="text-sm text-green-600">
                  Awarded: {formatPrice(item.awarded_cost)}
                </div>
              )}
              {item.actual_cost && (
                <div className="text-sm font-medium">
                  Actual: {formatPrice(item.actual_cost)}
                </div>
              )}
            </div>
          </div>
          {item.materials && item.materials.length > 0 && (
            <MaterialsBreakdown lineItemId={item.id} materials={item.materials} />
          )}
        </div>
      ))}
    </div>
  );
}