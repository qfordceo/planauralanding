import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

interface AnalysisResultsProps {
  results: string;
  resolutionNotes?: string;
  onClashSelect?: (clashId: string, position: { x: number, y: number, z: number }) => void;
  selectedClashId?: string | null;
  modelData?: any;
}

export function AnalysisResults({ 
  results, 
  resolutionNotes,
  onClashSelect,
  selectedClashId,
  modelData 
}: AnalysisResultsProps) {
  const handleClashClick = (elementId: string) => {
    if (onClashSelect && modelData) {
      const element = modelData.elements.find((e: any) => e.id === elementId);
      if (element) {
        onClashSelect(elementId, element.position);
      }
    }
  };

  return (
    <>
      <div className="rounded-lg bg-muted p-4">
        <pre className="whitespace-pre-wrap text-sm">
          {results}
        </pre>
        {modelData?.elements?.filter((e: any) => e.clash).map((element: any) => (
          <div 
            key={element.id}
            className={`mt-2 p-2 rounded ${
              selectedClashId === element.id ? 'bg-primary/10' : 'bg-background'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {element.type} clash at ({element.position.x.toFixed(2)}, 
                {element.position.y.toFixed(2)}, {element.position.z.toFixed(2)})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleClashClick(element.id)}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Navigate
              </Button>
            </div>
          </div>
        ))}
      </div>
      {resolutionNotes && (
        <div className="rounded-lg bg-green-50 p-4">
          <h4 className="font-medium text-green-900">Resolution Notes</h4>
          <p className="mt-1 text-green-700">{resolutionNotes}</p>
        </div>
      )}
    </>
  );
}