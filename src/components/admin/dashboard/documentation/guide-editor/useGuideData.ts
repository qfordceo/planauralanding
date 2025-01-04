import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Guide } from "./types";

export function useGuideData(guideId: string | null) {
  const { data: guide, isLoading } = useQuery({
    queryKey: ['guide', guideId],
    queryFn: async () => {
      if (!guideId) return null;
      const { data, error } = await supabase
        .from('documentation_guides')
        .select('*')
        .eq('id', guideId)
        .single();

      if (error) throw error;
      return data as Guide;
    },
    enabled: !!guideId
  });

  return { guide, isLoading };
}