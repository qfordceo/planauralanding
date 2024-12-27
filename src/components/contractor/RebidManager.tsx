import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RebidManagerProps {
  contractorId: string;
}

export function RebidManager({ contractorId }: RebidManagerProps) {
  const { toast } = useToast();
  const [newBidAmounts, setNewBidAmounts] = useState<Record<string, number>>({});

  const { data: outbidBids, isLoading, refetch } = useQuery({
    queryKey: ['outbid-bids', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractor_bids')
        .select(`
          *,
          project:project_id(title)
        `)
        .eq('contractor_id', contractorId)
        .eq('outbid', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const submitNewBid = async (projectId: string, oldBidId: string) => {
    const newAmount = newBidAmounts[oldBidId];
    if (!newAmount) return;

    const { error } = await supabase
      .from('contractor_bids')
      .insert({
        project_id: projectId,
        contractor_id: contractorId,
        bid_amount: newAmount,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit new bid",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "New bid submitted successfully",
      });
      refetch();
      setNewBidAmounts(prev => {
        const updated = { ...prev };
        delete updated[oldBidId];
        return updated;
      });
    }
  };

  if (isLoading) return <div>Loading outbid projects...</div>;

  return (
    <div className="space-y-4">
      {outbidBids?.map((bid) => (
        <div key={bid.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Project: {bid.project?.title}</h3>
            <span className="text-sm text-muted-foreground">
              Current bid: ${bid.bid_amount}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Input
              type="number"
              placeholder="Enter new bid amount"
              value={newBidAmounts[bid.id] || ''}
              onChange={(e) => setNewBidAmounts(prev => ({
                ...prev,
                [bid.id]: parseFloat(e.target.value)
              }))}
              className="max-w-[200px]"
            />
            <Button
              onClick={() => submitNewBid(bid.project_id, bid.id)}
              disabled={!newBidAmounts[bid.id]}
            >
              Submit New Bid
            </Button>
          </div>
        </div>
      ))}
      {!outbidBids?.length && (
        <p className="text-center text-muted-foreground">
          No outbid projects to re-bid on.
        </p>
      )}
    </div>
  );
}