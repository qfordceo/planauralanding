import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="rooms">Rooms</TabsTrigger>
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Floor Plan Overview</h3>
          <p>Total Area: {analysis.totalArea} sq ft</p>
          <p>Number of Rooms: {analysis.rooms.length}</p>
        </div>
      </TabsContent>

      <TabsContent value="rooms">
        <div className="space-y-4">
          {analysis.rooms.map((room, index) => (
            <div key={index} className="p-4 border rounded">
              <h4 className="font-medium">{room.type}</h4>
              <p>Dimensions: {room.dimensions.width}' x {room.dimensions.length}'</p>
              <p>Area: {room.area} sq ft</p>
              <p>Features: {room.features.join(', ')}</p>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="materials">
        <div className="space-y-4">
          {analysis.materialEstimates.map((category, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium">{category.category}</h4>
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span>{item.quantity} {item.unit}</span>
                  <span>${item.estimatedCost}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="customize">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Customize Materials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Flooring Cost (per sq ft)</label>
              <Input
                type="number"
                value={customizations.flooringCostPerSqFt}
                onChange={(e) => onCustomizationChange({
                  flooringCostPerSqFt: parseFloat(e.target.value)
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Paint Cost (per sq ft)</label>
              <Input
                type="number"
                value={customizations.paintCostPerSqFt}
                onChange={(e) => onCustomizationChange({
                  paintCostPerSqFt: parseFloat(e.target.value)
                })}
              />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}