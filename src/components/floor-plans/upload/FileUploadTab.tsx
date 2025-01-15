import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileUploadTabProps {
  onUploadComplete: (url: string) => void;
}

const SUPPORTED_FORMATS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/x-ifc': 'ifc',
  'application/x-dwg': 'dwg',
  'application/x-rvt': 'rvt'
};

export function FileUploadTab({ onUploadComplete }: FileUploadTabProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileType = file.type || `application/x-${file.name.split('.').pop()}`;
      
      if (!Object.keys(SUPPORTED_FORMATS).includes(fileType)) {
        toast({
          title: "Error",
          description: "Unsupported file format. Please upload a JPG, PNG, IFC, DWG, or RVT file.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      setProgress(0);
      setError(null);

      const fileExt = SUPPORTED_FORMATS[fileType as keyof typeof SUPPORTED_FORMATS];
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('floor-plans')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('floor-plans')
        .getPublicUrl(fileName);

      // For BIM files, we need to process them first
      if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
        setProgress(50);
        
        const { data: processedData, error: processError } = await supabase.functions
          .invoke('process-bim-file', {
            body: { 
              fileUrl: publicUrl,
              fileType: fileExt
            }
          });

        if (processError) {
          throw processError;
        }

        setProgress(100);
      }

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
        {isLoading && (
          <Progress value={progress} className="w-full" />
        )}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="text-sm text-muted-foreground">
          Supported formats: JPG, PNG, IFC (BIM), DWG (AutoCAD), RVT (Revit)
        </div>
      </CardContent>
    </Card>
  );
}