import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BidNotificationsProps {
  contractorId: string;
}

export function BidNotifications({ contractorId }: BidNotificationsProps) {
  const { data: outbidBids, isLoading } = useQuery({
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

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div className="space-y-4">
      {outbidBids?.map((bid) => (
        <Alert key={bid.id} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Outbid on Project: {bid.project?.title}</AlertTitle>
          <AlertDescription>
            Your bid of ${bid.bid_amount} has been outbid. Consider submitting a new bid to stay competitive.
          </AlertDescription>
        </Alert>
      ))}
      {!outbidBids?.length && (
        <p className="text-center text-muted-foreground">
          No active bid notifications.
        </p>
      )}
    </div>
  );
}