import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MaterialSuggestion {
  material_name: string;
  description: string;
  sustainability_score: number;
  cost_impact: number;
  benefits: string[];
}

export function useAIMaterialSuggestions(
  preferences: Record<string, any>,
  budget: number,
  sustainability: Record<string, boolean>
) {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<MaterialSuggestion[]>([]);

  const { isLoading, error } = useQuery({
    queryKey: ['material-suggestions', preferences, budget, sustainability],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('material-advisor', {
        body: { preferences, budget, sustainability }
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to get material suggestions',
          variant: 'destructive',
        });
        throw error;
      }

      setSuggestions(data.suggestions);
      return data;
    },
    enabled: !!preferences && !!budget,
  });

  return { suggestions, isLoading, error };
}