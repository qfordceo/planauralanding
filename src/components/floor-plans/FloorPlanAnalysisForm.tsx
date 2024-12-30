import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface FloorPlanAnalysisFormProps {
  onAnalyze: (imageUrl: string) => void;
  isLoading: boolean;
}

export function FloorPlanAnalysisForm({ onAnalyze, isLoading }: FloorPlanAnalysisFormProps) {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Input
          type="url"
          placeholder="Enter floor plan image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Button 
          onClick={() => onAnalyze(imageUrl)}
          disabled={!imageUrl || isLoading}
        >
          Analyze Floor Plan
        </Button>
      </div>
      {isLoading && <Progress value={50} className="w-full" />}
    </div>
  );
}