import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { AnalysisResult, CustomizationOptions } from "@/types/floor-plans";

interface FloorPlanAnalysisResultsProps {
  analysis: AnalysisResult;
  customizations: CustomizationOptions;
  onCustomizationChange: (updates: Partial<CustomizationOptions>) => void;
}

export function FloorPlanAnalysisResults({ 
  analysis, 
  customizations,
  onCustomizationChange 
}: FloorPlanAnalysisResultsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="rooms">Rooms</TabsTrigger>
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Floor Plan Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Area</p>
                <p className="text-2xl font-bold">{analysis.totalArea} sq ft</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Number of Rooms</p>
                <p className="text-2xl font-bold">{analysis.rooms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rooms">
        <div className="grid gap-4">
          {analysis.rooms.map((room, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="capitalize">{room.type}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Dimensions</p>
                    <p>{room.dimensions.width}' × {room.dimensions.length}'</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p>{room.area} sq ft</p>
                  </div>
                </div>
                {room.features.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Features</p>
                    <p className="capitalize">{room.features.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="materials">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flooring Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.materialEstimates.map((room, index) => (
                  <div key={index} className="space-y-2">
                    <p className="font-medium capitalize">{room.name}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Area</p>
                        <p>{room.flooring.area} sq ft</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Cost</p>
                        <p>{formatPrice(room.flooring.estimates[0].cost)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paint Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.materialEstimates.map((room, index) => (
                  <div key={index} className="space-y-2">
                    <p className="font-medium capitalize">{room.name}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Wall Area</p>
                        <p>{room.paint.area} sq ft</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Cost</p>
                        <p>{formatPrice(room.paint.estimates[0].cost)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="customize">
        <Card>
          <CardHeader>
            <CardTitle>Material Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Flooring Options</h3>
              {analysis.customizationOptions.flooring.map((option, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{option.name}</span>
                  <span>${option.costPerSqFt}/sq ft</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Paint Options</h3>
              {analysis.customizationOptions.paint.map((option, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{option.name}</span>
                  <span>${option.costPerSqFt}/sq ft</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}