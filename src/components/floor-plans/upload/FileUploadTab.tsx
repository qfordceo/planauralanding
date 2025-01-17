import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { uploadFloorPlan, SUPPORTED_FORMATS } from '@/utils/fileUpload';
import { UploadProgress } from './UploadProgress';

interface FileUploadTabProps {
  onUploadComplete: (url: string) => void;
}

export function FileUploadTab({ onUploadComplete }: FileUploadTabProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      setProgress(0);
      setError(null);

      const publicUrl = await uploadFloorPlan(file);
      setProgress(100);
      onUploadComplete(publicUrl);
      
      toast({
        title: "Success",
        description: "Floor plan uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading floor plan:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload floor plan');
      toast({
        title: "Error",
        description: "Failed to upload floor plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Floor Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          accept=".jpg,.jpeg,.png,.ifc,.dwg,.rvt"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
        <UploadProgress 
          isLoading={isLoading}
          progress={progress}
          error={error}
        />
        <div className="text-sm text-muted-foreground">
          Supported formats: JPG, PNG, IFC (BIM), DWG (AutoCAD), RVT (Revit)
        </div>
      </CardContent>
    </Card>
  );
}