import { Card, CardContent } from "@/components/ui/card";
import { FloorPlanAnalyzer } from '../FloorPlanAnalyzer';

interface FloorPlanPreviewProps {
  imageUrl: string;
}

export function FloorPlanPreview({ imageUrl }: FloorPlanPreviewProps) {
  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <img 
            src={imageUrl} 
            alt="Uploaded floor plan" 
            className="w-full h-auto"
          />
        </CardContent>
      </Card>

      <FloorPlanAnalyzer imageUrl={imageUrl} />
    </>
  );
}