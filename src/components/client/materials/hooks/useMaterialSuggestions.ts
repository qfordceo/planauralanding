import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { MaterialCategory } from "../types";

export function useMaterialSuggestions(floorPlanId: string) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [materialCategories, setMaterialCategories] = useState<MaterialCategory[]>([]);

  const fetchMaterialSuggestions = async () => {
    setIsLoading(true);
    try {
      const { data: floorPlan } = await supabase
        .from('floor_plans')
        .select('*')
        .eq('id', floorPlanId)
        .single();

      if (!floorPlan) {
        throw new Error('Floor plan not found');
      }

      const response = await supabase.functions.invoke('suggest-materials', {
        body: { floorPlan }
      });

      if (response.error) throw response.error;
      
      setMaterialCategories(response.data.categories);
      
      toast({
        title: "Materials List Generated",
        description: "AI has generated a comprehensive list of required materials.",
      });
    } catch (error) {
      console.error('Error getting material suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate materials list. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    materialCategories,
    fetchMaterialSuggestions
  };
}