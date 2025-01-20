import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import { useMaterialSuggestions } from "./hooks/useMaterialSuggestions";
import { MaterialsList } from "./MaterialsList";
import { MaterialsCostSummary } from "./MaterialsCostSummary";
import type { MaterialsCardProps } from "./types";

export function MaterialsCard({ floorPlanId, onSelectionComplete }: MaterialsCardProps) {
  const { 
    isLoading, 
    materialCategories, 
    fetchMaterialSuggestions 
  } = useMaterialSuggestions(floorPlanId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Complete Materials List
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMaterialSuggestions}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Refresh List"
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <MaterialsCostSummary materialCategories={materialCategories} />
            <MaterialsList 
              materialCategories={materialCategories} 
              onSelectionComplete={onSelectionComplete}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}