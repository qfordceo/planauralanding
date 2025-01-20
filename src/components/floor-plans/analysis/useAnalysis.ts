import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult, CustomizationOptions } from "@/types/floor-plans";

export function useAnalysis(imageUrl: string | null, customizations: CustomizationOptions) {
  return useQuery({
    queryKey: ['floor-plan-analysis', imageUrl, customizations],
    queryFn: async (): Promise<AnalysisResult> => {
      if (!imageUrl) throw new Error('No image URL provided');

      const { data, error } = await supabase.functions.invoke('analyze-floor-plan', {
        body: { imageUrl, customizations }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!imageUrl,
  });
}