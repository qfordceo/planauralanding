export interface MaterialCategory {
  name: string;
  items: MaterialItem[];
  estimatedCost: number;
}

export interface MaterialItem {
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