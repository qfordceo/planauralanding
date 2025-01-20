import { Button } from "@/components/ui/button";
import { Ruler, Move, Square } from "lucide-react";

interface MeasurementToolsProps {
  onStartMeasure: (type: 'distance' | 'area') => void;
  onCancelMeasure: () => void;
}

export function MeasurementTools({
  onStartMeasure,
  onCancelMeasure
}: MeasurementToolsProps) {
  return (
    <div className="p-4 space-y-4 bg-background rounded-lg border">
      <h3 className="font-semibold">Measurement Tools</h3>
      
      <div className="flex flex-col space-y-2">
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => onStartMeasure('distance')}
        >
          <Ruler className="mr-2 h-4 w-4" />
          Measure Distance
        </Button>
        
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => onStartMeasure('area')}
        >
          <Square className="mr-2 h-4 w-4" />
          Measure Area
        </Button>
        
        <Button
          variant="ghost"
          className="justify-start text-destructive"
          onClick={onCancelMeasure}
        >
          Cancel Measurement
        </Button>
      </div>
    </div>
  );
}