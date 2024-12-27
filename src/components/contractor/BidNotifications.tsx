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
  const { data: outbidBids, isLoading, error } = useQuery({
    queryKey: ['outbid-bids', contractorId],
    queryFn: async () => {
      // First fetch the bids with a simpler query
      const { data: bidsData, error: bidsError } = await supabase
        .from('contractor_bids')
        .select('id, project_id, bid_amount, outbid')
        .eq('contractor_id', contractorId)
        .eq('outbid', true);

      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
        throw bidsError;
      }

      if (!bidsData?.length) {
        return [];
      }

      // Then fetch project titles in a separate query
      const projectIds = bidsData.map(bid => bid.project_id);
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, title')
        .in('id', projectIds);

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }

      // Map project titles to bids
      const projectTitleMap = new Map(
        projectsData?.map(project => [project.id, project.title]) || []
      );

      return bidsData.map(bid => ({
        ...bid,
        project_title: projectTitleMap.get(bid.project_id) || 'Unknown Project'
      }));
    },
  });

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load bid notifications. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {outbidBids?.map((bid) => (
        <Alert key={bid.id} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Outbid on Project: {bid.project_title}</AlertTitle>
          <AlertDescription>
            Your bid of ${bid.bid_amount.toLocaleString()} has been outbid. Consider submitting a new bid to stay competitive.
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