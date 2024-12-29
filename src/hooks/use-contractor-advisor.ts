import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useContractorAdvisor() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getAdvice = async (section: string, data: any) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('contractor-advisor', {
        body: { section, data }
      });

      if (error) throw error;
      
      return response.analysis;
    } catch (error) {
      console.error('Error getting AI advice:', error);
      toast({
        title: "Error",
        description: "Failed to get AI analysis. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getAdvice,
    isLoading
  };
}