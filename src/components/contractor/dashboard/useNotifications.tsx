import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Contractor } from "@/types/contractor";

export function useNotifications(contractor: Contractor | null, setOutbidCount: (count: number) => void, setDefectCount: (count: number) => void) {
  const fetchOutbidCount = async () => {
    if (!contractor) return;
    
    const { count, error } = await supabase
      .from('contractor_bids')
      .select('*', { count: 'exact', head: true })
      .eq('contractor_id', contractor.id)
      .eq('outbid', true);

    if (!error && count !== null) {
      setOutbidCount(count);
    }
  };

  const fetchDefectCount = async () => {
    if (!contractor) return;
    
    const { count, error } = await supabase
      .from('contractor_inspection_defects')
      .select('*', { count: 'exact', head: true })
      .eq('contractor_id', contractor.id)
      .eq('resolved', false);

    if (!error && count !== null) {
      setDefectCount(count);
    }
  };

  const subscribeToOutbids = () => {
    const channel = supabase
      .channel('contractor-outbids')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contractor_bids',
          filter: `contractor_id=eq.${contractor?.id}`,
        },
        () => {
          fetchOutbidCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    if (contractor) {
      subscribeToOutbids();
      fetchOutbidCount();
      fetchDefectCount();
    }
  }, [contractor]);
}