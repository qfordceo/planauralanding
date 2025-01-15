import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomizationList } from './CustomizationList';
import { BudgetSummary } from './BudgetSummary';
import { AIRecommendations } from './AIRecommendations';
import { useCustomizationPresence } from '@/hooks/useCustomizationPresence';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/ui/user-avatar';
import { supabase } from '@/integrations/supabase/client';

interface CustomizationPanelProps {
  floorPlanId: string;
}

export function CustomizationPanel({ floorPlanId }: CustomizationPanelProps) {
  const { toast } = useToast();
  const activeUsers = useCustomizationPresence(floorPlanId);
  const [budgetAnalysis, setBudgetAnalysis] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Array<{
    customization_id: string;
    quantity: number;
  }>>([]);

  useEffect(() => {
    // Fetch customization options
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

  const calculateBudget = async (customizations: Array<{ customization_id: string; quantity: number }>) => {
    setIsCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-budget', {
        body: { 
          customizations,
          floorPlanId,
          location: 'user-location' // You'd want to get this from user data
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Customize Your Home</span>
          <div className="flex items-center gap-2">
            {activeUsers.map((user) => (
              <div key={user.user_id} className="flex items-center">
                <UserAvatar
                  user={user}
                  className="h-6 w-6"
                />
                <Badge variant="outline" className="ml-2">
                  Viewing
                </Badge>
              </div>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="floorplan">
          <TabsList>
            <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="finishes">Finishes</TabsTrigger>
          </TabsList>

          {['floorplan', 'materials', 'finishes'].map(type => (
            <TabsContent key={type} value={type}>
              <CustomizationList
                options={options}
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