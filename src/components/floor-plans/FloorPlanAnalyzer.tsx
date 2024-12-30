import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisResult {
  rooms: {
    type: string;
    dimensions: {
      width: number;
      length: number;
    };
    area: number;
    features: string[];
  }[];
  totalArea: number;
  materialEstimates: {
    category: string;
    items: {
      name: string;
      quantity: number;
      unit: string;
      estimatedCost: number;
    }[];
  }[];
}

export function FloorPlanAnalyzer() {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [customizations, setCustomizations] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeFloorPlan = async () => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-floor-plan', {
        body: { imageUrl, customizations }
      });

      if (response.error) throw response.error;
      return response.data;
    } catch (error) {
      console.error('Error analyzing floor plan:', error);
      toast({
        title: "Error",
        description: "Failed to analyze floor plan",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['floor-plan-analysis', imageUrl, customizations],
    queryFn: analyzeFloorPlan,
    enabled: !!imageUrl && isAnalyzing
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Floor Plan Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Enter floor plan image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button 
              onClick={() => setIsAnalyzing(true)}
              disabled={!imageUrl || isLoading}
            >
              Analyze Floor Plan
            </Button>
          </div>

          {isLoading && <Progress value={50} className="w-full" />}

          {analysis && (
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
                {/* Add customization controls here */}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
}