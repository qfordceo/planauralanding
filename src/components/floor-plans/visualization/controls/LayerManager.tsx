import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LayerManagerProps {
  onLayerToggle: (layer: string, enabled: boolean) => void;
}

export function LayerManager({ onLayerToggle }: LayerManagerProps) {
  const [layers, setLayers] = useState({
    walls: true,
    electrical: true,
    plumbing: true,
    furniture: true,
    measurements: true
  });

  const handleToggle = (layer: keyof typeof layers) => {
    setLayers(prev => {
      const newState = { ...prev, [layer]: !prev[layer] };
      onLayerToggle(layer, newState[layer]);
      return newState;
    });
  };

  return (
    <div className="p-4 space-y-4 bg-background rounded-lg border">
      <h3 className="font-semibold">Layer Controls</h3>
      <div className="space-y-4">
        {Object.entries(layers).map(([layer, enabled]) => (
          <div key={layer} className="flex items-center space-x-2">
            <Switch
              id={`layer-${layer}`}
              checked={enabled}
              onCheckedChange={() => handleToggle(layer as keyof typeof layers)}
            />
            <Label htmlFor={`layer-${layer}`} className="capitalize">
              {layer}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}