import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentMilestone {
  id: string;
  title: string;
  amount: number;
  due_date: string;
  status: string;
  invoice_generated: boolean;
  invoice_url?: string;
}

interface PaymentMilestonesProps {
  contractorId: string;
  projectId: string;
}

export function PaymentMilestones({ contractorId, projectId }: PaymentMilestonesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    amount: "",
    due_date: new Date(),
  });

  const { data: milestones, isLoading } = useQuery({
    queryKey: ["payment-milestones", contractorId, projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_payment_milestones")
        .select("*")
        .eq("contractor_id", contractorId)
        .eq("project_id", projectId)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as PaymentMilestone[];
    },
  });

  const addMilestone = useMutation({
    mutationFn: async (milestoneData: typeof newMilestone) => {
      const { error } = await supabase.from("contractor_payment_milestones").insert([
        {
          contractor_id: contractorId,
          project_id: projectId,
          title: milestoneData.title,
          amount: parseFloat(milestoneData.amount),
          due_date: milestoneData.due_date.toISOString(),
          status: "pending",
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-milestones"] });
      setIsAddingMilestone(false);
      setNewMilestone({ title: "", amount: "", due_date: new Date() });
      toast({
        title: "Success",
        description: "Payment milestone added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add payment milestone",
        variant: "destructive",
      });
      console.error("Error adding payment milestone:", error);
    },
  });

  const generateInvoice = useMutation({
    mutationFn: async (milestoneId: string) => {
      // TODO: Implement invoice generation logic
      const { error } = await supabase
        .from("contractor_payment_milestones")
        .update({ invoice_generated: true })
        .eq("id", milestoneId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-milestones"] });
      toast({
        title: "Success",
        description: "Invoice generated successfully",
      });
    },
  });

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <div className="space-y-4">
      {!isAddingMilestone && (
        <Button onClick={() => setIsAddingMilestone(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Milestone
        </Button>
      )}

      {isAddingMilestone && (
        <div className="space-y-4 p-4 border rounded-lg">
          <Input
            placeholder="Milestone Title"
            value={newMilestone.title}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, title: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Amount"
            value={newMilestone.amount}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, amount: e.target.value })
            }
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !newMilestone.due_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newMilestone.due_date ? (
                  format(newMilestone.due_date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newMilestone.due_date}
                onSelect={(date) =>
                  setNewMilestone({ ...newMilestone, due_date: date || new Date() })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingMilestone(false);
                setNewMilestone({ title: "", amount: "", due_date: new Date() });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => addMilestone.mutate(newMilestone)}
              disabled={!newMilestone.title || !newMilestone.amount}
            >
              Add Milestone
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {milestones?.map((milestone) => (
          <div
            key={milestone.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{milestone.title}</h3>
              <p className="text-sm text-muted-foreground">
                Due: {format(new Date(milestone.due_date), "PPP")}
              </p>
              <p className="text-sm font-medium">
                Amount: ${milestone.amount.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    milestone.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  )}
                >
                  {milestone.status}
                </span>
                {milestone.invoice_generated && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Invoice Generated
                  </span>
                )}
              </div>
            </div>
            {!milestone.invoice_generated && (
              <Button
                variant="outline"
                onClick={() => generateInvoice.mutate(milestone.id)}
              >
                Generate Invoice
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}