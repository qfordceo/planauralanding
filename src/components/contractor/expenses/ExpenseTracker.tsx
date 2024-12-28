import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash, Receipt } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  receipt_url?: string;
  tax_category?: string;
}

const EXPENSE_CATEGORIES = [
  "Materials",
  "Tools",
  "Labor",
  "Transportation",
  "Insurance",
  "Office",
  "Marketing",
  "Other",
];

const TAX_CATEGORIES = [
  "Business Expense",
  "Capital Expense",
  "Vehicle Expense",
  "Home Office",
  "Other",
];

export function ExpenseTracker({ contractorId }: { contractorId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    tax_category: "",
  });

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["contractor-expenses", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_expenses")
        .select("*")
        .eq("contractor_id", contractorId)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Expense[];
    },
  });

  const addExpense = useMutation({
    mutationFn: async (expenseData: typeof newExpense) => {
      const { error } = await supabase.from("contractor_expenses").insert([
        {
          ...expenseData,
          amount: parseFloat(expenseData.amount),
          contractor_id: contractorId,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-expenses"] });
      setIsAdding(false);
      setNewExpense({
        amount: "",
        description: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        tax_category: "",
      });
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
      console.error("Error adding expense:", error);
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase
        .from("contractor_expenses")
        .delete()
        .eq("id", expenseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-expenses"] });
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
      console.error("Error deleting expense:", error);
    },
  });

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <div className="space-y-4">
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      )}

      {isAdding && (
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
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={() => addExpense.mutate(newExpense)}>
              Add Expense
            </Button>
          </div>
        </div>
      )}

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
                onClick={() => deleteExpense.mutate(expense.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}