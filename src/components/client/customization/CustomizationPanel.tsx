import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomizationTabs } from './CustomizationTabs';
import { BudgetSummary } from './BudgetSummary';
import { AIMaterialSuggestions } from './AIMaterialSuggestions';
import { useCustomizationPresence } from '@/hooks/useCustomizationPresence';
import { useCustomizations } from '@/hooks/useCustomizations';
import { useAIMaterialSuggestions } from '@/hooks/useAIMaterialSuggestions';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CustomizationPanelProps {
  floorPlanId: string;
}

export function CustomizationPanel({ floorPlanId }: CustomizationPanelProps) {
  const activeUsers = useCustomizationPresence(floorPlanId);
  const {
    options,
    selectedCustomizations,
    budgetAnalysis,
    isCalculating,
    handleCustomizationChange,
    preferences,
    sustainability
  } = useCustomizations(floorPlanId);

  const { suggestions, isLoading: isLoadingAI } = useAIMaterialSuggestions(
    preferences,
    budgetAnalysis?.totalCost || 0,
    sustainability
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Customize Your Home</span>
          <div className="flex items-center gap-2">
            {activeUsers.map((user) => (
              <div key={user.user_id} className="flex items-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user_id}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Badge variant="outline" className="ml-2">
                  Viewing
                </Badge>
              </div>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CustomizationTabs
          options={options}
          selectedCustomizations={selectedCustomizations}
          onCustomizationChange={handleCustomizationChange}
        />

        <div className="mt-6 space-y-6">
          <BudgetSummary
            isLoading={isCalculating}
            budgetAnalysis={budgetAnalysis}
          />
          
          <AIMaterialSuggestions
            suggestions={suggestions}
            isLoading={isLoadingAI}
          />
        </div>
      </CardContent>
    </Card>
  );
}