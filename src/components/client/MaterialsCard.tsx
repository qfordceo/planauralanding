import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaintBucket, Palette, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MaterialSelection {
  category: string;
  name: string;
  color?: string;
  url?: string;
}

interface MaterialsCardProps {
  floorPlanId: string;
}

export function MaterialsCard({ floorPlanId }: MaterialsCardProps) {
  const { toast } = useToast();
  const [selectedMaterials, setSelectedMaterials] = useLocalStorage<MaterialSelection[]>('selected-materials', []);

  // Predefined paint color suggestions based on modern home design trends
  const paintSuggestions = [
    { name: "Neutral Gray", color: "#8E9196" },
    { name: "Soft White", color: "#FFFFFF" },
    { name: "Warm Beige", color: "#F5F5DC" },
    { name: "Soft Green", color: "#F2FCE2" },
    { name: "Soft Blue", color: "#D3E4FD" },
    { name: "Light Purple", color: "#D6BCFA" },
  ];

  const handleMaterialSelect = (material: MaterialSelection) => {
    setSelectedMaterials(prev => {
      const filtered = prev.filter(m => m.category !== material.category);
      return [...filtered, material];
    });

    toast({
      title: "Material Selected",
      description: `${material.name} has been saved to your selections.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Materials Selection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paint" className="space-y-4">
          <TabsList>
            <TabsTrigger value="paint">
              <PaintBucket className="h-4 w-4 mr-2" />
              Paint Colors
            </TabsTrigger>
            <TabsTrigger value="materials">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Building Materials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paint" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {paintSuggestions.map((paint) => (
                <div
                  key={paint.color}
                  className="p-4 rounded-lg border hover:border-primary cursor-pointer"
                  onClick={() => handleMaterialSelect({
                    category: 'paint',
                    name: paint.name,
                    color: paint.color
                  })}
                >
                  <div
                    className="w-full h-20 rounded-md mb-2"
                    style={{ backgroundColor: paint.color }}
                  />
                  <p className="text-sm font-medium">{paint.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Bathroom Fixtures</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Modern Toilet Set</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMaterialSelect({
                        category: 'bathroom',
                        name: 'Modern Toilet Set',
                        url: 'https://example.com/toilet'
                      })}
                    >
                      Select
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Premium Sink Faucet</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMaterialSelect({
                        category: 'bathroom',
                        name: 'Premium Sink Faucet',
                        url: 'https://example.com/faucet'
                      })}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Flooring</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Hardwood Oak</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMaterialSelect({
                        category: 'flooring',
                        name: 'Hardwood Oak',
                        url: 'https://example.com/hardwood'
                      })}
                    >
                      Select
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Luxury Vinyl Tile</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMaterialSelect({
                        category: 'flooring',
                        name: 'Luxury Vinyl Tile',
                        url: 'https://example.com/vinyl'
                      })}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {selectedMaterials.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Your Selections</h3>
            <div className="space-y-2">
              {selectedMaterials.map((material, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    {material.color && (
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: material.color }}
                      />
                    )}
                    <span>{material.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMaterials(prev => 
                      prev.filter(m => m.name !== material.name)
                    )}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}