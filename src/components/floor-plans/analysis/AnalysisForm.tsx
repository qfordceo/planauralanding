import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface AnalysisFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function AnalysisForm({ onAnalyze, isLoading }: AnalysisFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('imageUrl') as string;
    if (url) onAnalyze(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="url"
        name="imageUrl"
        placeholder="Enter floor plan image URL"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        Analyze Floor Plan
      </Button>
    </form>
  );
}