import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Light } from 'three';

interface LightingControlsProps {
  onIntensityChange: (intensity: number) => void;
  onShadowsToggle: (enabled: boolean) => void;
  onPositionChange: (x: number, y: number, z: number) => void;
}

export function LightingControls({
  onIntensityChange,
  onShadowsToggle,
  onPositionChange
}: LightingControlsProps) {
  return (
    <div className="p-4 space-y-4 bg-background rounded-lg border">
      <h3 className="font-semibold">Lighting Controls</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Light Intensity</Label>
          <Slider
            defaultValue={[1]}
            max={2}
            step={0.1}
            onValueChange={([value]) => onIntensityChange(value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="shadows"
            onCheckedChange={onShadowsToggle}
            defaultChecked
          />
          <Label htmlFor="shadows">Enable Shadows</Label>
        </div>

        <div className="space-y-2">
          <Label>Light Position X</Label>
          <Slider
            defaultValue={[1]}
            min={-10}
            max={10}
            step={0.1}
            onValueChange={([x]) => onPositionChange(x, 1, 1)}
          />
        </div>
      </div>
    </div>
  );
}