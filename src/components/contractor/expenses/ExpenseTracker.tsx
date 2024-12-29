import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from "./ExpenseList";
import type { Expense } from "./types";

export function ExpenseTracker({ contractorId }: { contractorId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

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
    mutationFn: async (expenseData: any) => {
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
        <ExpenseForm
          onSubmit={(data) => addExpense.mutate(data)}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <ExpenseList
        expenses={expenses || []}
        onDelete={(id) => deleteExpense.mutate(id)}
      />
    </div>
  );
}