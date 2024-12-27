import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BidNotificationsProps {
  contractorId: string;
}

interface Bid {
  id: string;
  project_id: string;
  bid_amount: number;
  outbid: boolean;
  project_title?: string;
}

export function BidNotifications({ contractorId }: BidNotificationsProps) {
  const { data: outbidBids, isLoading } = useQuery({
    queryKey: ['outbid-bids', contractorId],
    queryFn: async () => {
      // First fetch the bids
      const { data: bidsData, error: bidsError } = await supabase
        .from('contractor_bids')
        .select('*')
        .eq('contractor_id', contractorId)
        .eq('outbid', true)
        .order('updated_at', { ascending: false });

      if (bidsError) throw bidsError;

      // Then fetch the project titles separately
      const bids = await Promise.all(
        (bidsData || []).map(async (bid) => {
          const { data: projectData } = await supabase
            .from('projects')
            .select('title')
            .eq('id', bid.project_id)
            .single();

          return {
            ...bid,
            project_title: projectData?.title || 'Unknown Project'
          };
        })
      );

      return bids as Bid[];
    },
  });

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div className="space-y-4">
      {outbidBids?.map((bid) => (
        <Alert key={bid.id} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Outbid on Project: {bid.project_title}</AlertTitle>
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