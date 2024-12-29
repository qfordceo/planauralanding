export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  receipt_url?: string;
  tax_category?: string;
}