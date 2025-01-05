import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface RealTimeCostsProps {
  buildEstimateId: string;
  onCostUpdate: (costs: {
    estimated: number;
    awarded: number;
    actual: number;
  }) => void;
}

export function RealTimeCosts({ buildEstimateId, onCostUpdate }: RealTimeCostsProps) {
  const { data: costs } = useQuery({
    queryKey: ['build-costs', buildEstimateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('build_line_items')
        .select('estimated_cost, awarded_cost, actual_cost')
        .eq('build_estimate_id', buildEstimateId);
      
      if (error) throw error;
      
      const totals = data.reduce((acc, item) => ({
        estimated: acc.estimated + (item.estimated_cost || 0),
        awarded: acc.awarded + (item.awarded_cost || 0),
        actual: acc.actual + (item.actual_cost || 0),
      }), { estimated: 0, awarded: 0, actual: 0 });

      return totals;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('build-costs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'build_line_items',
          filter: `build_estimate_id=eq.${buildEstimateId}`,
        },
        () => {
          // Refetch costs when changes occur
          costs && onCostUpdate(costs);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [buildEstimateId, costs, onCostUpdate]);

  return null;
}