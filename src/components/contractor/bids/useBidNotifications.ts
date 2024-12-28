import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bid } from "./types";

export function useBidNotifications(contractorId: string) {
  return useQuery({
    queryKey: ['outbid-bids', contractorId],
    queryFn: async () => {
      try {
        // Fetch outbid bids
        const { data: bids, error: bidsError } = await supabase
          .from('contractor_bids')
          .select('id, project_id, bid_amount, outbid')
          .eq('contractor_id', contractorId)
          .eq('outbid', true);

        if (bidsError) {
          console.error('Bids query failed:', bidsError);
          throw bidsError;
        }

        if (!bids?.length) {
          return [];
        }

        // Fetch project titles in a separate query
        const projectIds = bids.map(bid => bid.project_id);
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('id, title')
          .in('id', projectIds);

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
    retry: 1,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}