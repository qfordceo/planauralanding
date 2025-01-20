import { Card } from "@/components/ui/card";
import { ViewerControls } from '../controls/ViewerControls';

interface SceneControlsProps {
  onLayerToggle: (layerName: string, enabled: boolean) => void;
  onLightingChange: (intensity: number) => void;
  onShadowsToggle: (enabled: boolean) => void;
  onLightPositionChange: (x: number, y: number, z: number) => void;
  onStartMeasure: (type: 'none' | 'distance' | 'area') => void;
  onCancelMeasure: () => void;
  onExport: (format: string) => void;
}

export function SceneControls({
  onLayerToggle,
  onLightingChange,
  onShadowsToggle,
  onLightPositionChange,
  onStartMeasure,
  onCancelMeasure,
  onExport
}: SceneControlsProps) {
  return (
    <ViewerControls
      onLayerToggle={onLayerToggle}
      onLightingChange={onLightingChange}
      onShadowsToggle={onShadowsToggle}
      onLightPositionChange={onLightPositionChange}
      onStartMeasure={onStartMeasure}
      onCancelMeasure={onCancelMeasure}
      onExport={onExport}
    />
  );
}