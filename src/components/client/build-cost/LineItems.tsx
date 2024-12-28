import { formatPrice } from "@/lib/utils";

interface LineItem {
  id: string;
  description: string;
  actual_cost?: number;
  estimated_cost?: number;
}

interface LineItemsProps {
  items: LineItem[];
}

export function LineItems({ items }: LineItemsProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between">
          <span>{item.description}</span>
          <span>{formatPrice(item.actual_cost || item.estimated_cost || 0)}</span>
        </div>
      ))}
    </div>
  );
}