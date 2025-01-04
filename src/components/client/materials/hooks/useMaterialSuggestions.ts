import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useMaterialSuggestions(floorPlanId: string) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['material-suggestions', floorPlanId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('suggest-materials', {
        body: { floorPlanId }
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch material suggestions",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    }
  });
}