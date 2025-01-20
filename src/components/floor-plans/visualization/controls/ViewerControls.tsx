import { LayerManager } from './LayerManager';
import { LightingControls } from './LightingControls';
import { MeasurementTools } from './MeasurementTools';
import { ExportControls } from './ExportControls';

interface ViewerControlsProps {
  onLayerToggle: (layerName: string, enabled: boolean) => void;
  onLightingChange: (intensity: number) => void;
  onShadowsToggle: (enabled: boolean) => void;
  onLightPositionChange: (x: number, y: number, z: number) => void;
  onStartMeasure: (type: 'none' | 'distance' | 'area') => void;
  onCancelMeasure: () => void;
  onExport: (format: string) => void;
}

export function ViewerControls({
  onLayerToggle,
  onLightingChange,
  onShadowsToggle,
  onLightPositionChange,
  onStartMeasure,
  onCancelMeasure,
  onExport
}: ViewerControlsProps) {
  return (
    <div className="space-y-4">
      <LayerManager onLayerToggle={onLayerToggle} />
      <LightingControls
        onIntensityChange={onLightingChange}
        onShadowsToggle={onShadowsToggle}
        onPositionChange={onLightPositionChange}
      />
      <MeasurementTools
        onStartMeasure={onStartMeasure}
        onCancelMeasure={onCancelMeasure}
      />
      <ExportControls onExport={onExport} />
    </div>
  );
}