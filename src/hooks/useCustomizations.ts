import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomizationType {
  customization_id: string;
  quantity: number;
}

export function useCustomizations(floorPlanId: string) {
  const { toast } = useToast();
  const [budgetAnalysis, setBudgetAnalysis] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState<CustomizationType[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const { data } = await supabase
        .from('customization_options')
        .select('*');
      setOptions(data || []);
    };
    fetchOptions();
  }, []);

  const handleCustomizationChange = (customizationId: string, quantity: number) => {
    setSelectedCustomizations(prev => {
      const newCustomizations = prev.filter(c => c.customization_id !== customizationId);
      if (quantity > 0) {
        newCustomizations.push({ customization_id: customizationId, quantity });
      }
      return newCustomizations;
    });

    calculateBudget(selectedCustomizations);
  };

  const calculateBudget = async (customizations: CustomizationType[]) => {
    setIsCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-budget', {
        body: { 
          customizations,
          floorPlanId,
          location: 'user-location'
        }
      });

      if (error) throw error;
      
      setBudgetAnalysis(data);
      
      toast({
        title: "Calculations Updated",
        description: "Budget and recommendations have been refreshed.",
      });
    } catch (error) {
      console.error('Error calculating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update calculations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    options,
    selectedCustomizations,
    budgetAnalysis,
    isCalculating,
    handleCustomizationChange
  };
}