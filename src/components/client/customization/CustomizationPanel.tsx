import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { CustomizationList } from "./CustomizationList";
import { BudgetSummary } from "./BudgetSummary";
import { AIRecommendations } from "./AIRecommendations";

interface CustomizationPanelProps {
  floorPlanId: string;
}

export function CustomizationPanel({ floorPlanId }: CustomizationPanelProps) {
  const { toast } = useToast();
  const [selectedCustomizations, setSelectedCustomizations] = useState<Array<{
    customization_id: string;
    quantity: number;
  }>>([]);

  const { data: customizationOptions, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['customization-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customization_options')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: budgetAnalysis, isLoading: isCalculating } = useQuery({
    queryKey: ['budget-analysis', selectedCustomizations],
    queryFn: async () => {
      const response = await supabase.functions.invoke('calculate-budget', {
        body: { customizations: selectedCustomizations, floorPlanId }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    enabled: selectedCustomizations.length > 0
  });

  const handleCustomizationChange = async (
    customizationId: string,
    quantity: number
  ) => {
    const newCustomizations = selectedCustomizations.filter(
      c => c.customization_id !== customizationId
    );

    if (quantity > 0) {
      newCustomizations.push({
        customization_id: customizationId,
        quantity
      });
    }

    setSelectedCustomizations(newCustomizations);

    toast({
      title: "Customization Updated",
      description: "Budget calculations are being updated..."
    });
  };

  if (isLoadingOptions) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Home</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="floorplan" className="w-full">
          <TabsList>
            <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="finishes">Finishes</TabsTrigger>
          </TabsList>

          {['floorplan', 'materials', 'finishes'].map(type => (
            <TabsContent key={type} value={type}>
              <CustomizationList
                options={customizationOptions?.filter(opt => opt.type === type) || []}
                selectedCustomizations={selectedCustomizations}
                onCustomizationChange={handleCustomizationChange}
              />
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 space-y-6">
          <BudgetSummary
            isLoading={isCalculating}
            budgetAnalysis={budgetAnalysis}
          />
          
          <AIRecommendations
            isLoading={isCalculating}
            recommendations={budgetAnalysis?.recommendations}
          />
        </div>
      </CardContent>
    </Card>
  );
}