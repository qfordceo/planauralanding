import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bid } from "./types";

export function useBidNotifications(contractorId: string) {
  return useQuery({
    queryKey: ['outbid-bids', contractorId],
    queryFn: async () => {
      console.log('Starting bid fetch for contractor:', contractorId);
      
      try {
        // First try a simple query to test access
        const { data: testBid, error: testError } = await supabase
          .from('contractor_bids')
          .select('id')
          .eq('contractor_id', contractorId)
          .limit(1)
          .single();

        console.log('Test bid query result:', { testBid, testError });

        if (testError) {
          console.error('Test bid query failed:', testError);
          throw testError;
        }

        // If test succeeds, try the full query
        const { data: bids, error: bidsError } = await supabase
          .from('contractor_bids')
          .select('id, project_id, bid_amount, outbid')
          .eq('contractor_id', contractorId)
          .eq('outbid', true);

        console.log('Full bids query result:', { bids, bidsError });

        if (bidsError) {
          console.error('Full bids query failed:', bidsError);
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

        console.log('Projects query result:', { projects, projectsError });

        if (projectsError) {
          console.error('Projects query failed:', projectsError);
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
      } catch (error) {
        console.error('Unexpected error in bid notifications:', error);
        throw error;
      }
    },
    retry: false,
  });
}