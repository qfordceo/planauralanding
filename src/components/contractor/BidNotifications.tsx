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
      console.log('Fetching outbid bids for contractor:', contractorId);
      
      // First fetch just the bids
      const { data: bids, error: bidsError } = await supabase
        .from('contractor_bids')
        .select('id, project_id, bid_amount')
        .eq('contractor_id', contractorId)
        .eq('outbid', true);

      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
        throw bidsError;
      }

      if (!bids?.length) {
        console.log('No outbid bids found');
        return [];
      }

      // Then fetch project titles
      const projectIds = bids.map(bid => bid.project_id);
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, title')
        .in('id', projectIds);

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }

      // Map project titles to bids
      const projectTitleMap = new Map(
        projects?.map(project => [project.id, project.title]) || []
      );

      return bids.map(bid => ({
        ...bid,
        project_title: projectTitleMap.get(bid.project_id) || 'Unknown Project'
      }));
    },
    retry: 1,
  });

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>;
  }

  if (error) {
    console.error('Query error:', error);
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