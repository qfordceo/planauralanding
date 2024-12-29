import { Button } from "@/components/ui/button";
import { Receipt, Trash } from "lucide-react";
import type { Expense } from "./types";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  return (
    <div className="grid gap-4">
      {expenses?.map((expense) => (
        <div
          key={expense.id}
          className="p-4 border rounded-lg flex justify-between items-start"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                ${expense.amount.toFixed(2)}
              </h3>
              <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                {expense.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{expense.description}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(expense.date).toLocaleDateString()}
            </p>
            {expense.tax_category && (
              <p className="text-sm text-muted-foreground">
                Tax Category: {expense.tax_category}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {expense.receipt_url && (
              <Button variant="ghost" size="icon" asChild>
                <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer">
                  <Receipt className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(expense.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}