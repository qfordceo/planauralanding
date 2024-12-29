import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES, TAX_CATEGORIES } from "./expenseConstants";

interface ExpenseFormProps {
  onSubmit: (expenseData: any) => void;
  onCancel: () => void;
}

export function ExpenseForm({ onSubmit, onCancel }: ExpenseFormProps) {
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    tax_category: "",
  });

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <Input
        type="number"
        placeholder="Amount"
        value={newExpense.amount}
        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
      />
      <Textarea
        placeholder="Description"
        value={newExpense.description}
        onChange={(e) =>
          setNewExpense({ ...newExpense, description: e.target.value })
        }
      />
      <Select
        value={newExpense.category}
        onValueChange={(value) =>
          setNewExpense({ ...newExpense, category: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {EXPENSE_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={newExpense.date}
        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
      />
      <Select
        value={newExpense.tax_category}
        onValueChange={(value) =>
          setNewExpense({ ...newExpense, tax_category: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Tax Category" />
        </SelectTrigger>
        <SelectContent>
          {TAX_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSubmit(newExpense)}>Add Expense</Button>
      </div>
    </div>
  );
}