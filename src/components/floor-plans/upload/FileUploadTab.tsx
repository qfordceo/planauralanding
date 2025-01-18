import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { uploadFloorPlan } from '@/utils/fileUpload';
import { UploadProgress } from './UploadProgress';
import { Upload } from 'lucide-react'; // Changed from FileUpload to Upload
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';

interface FileUploadTabProps {
  onUploadComplete: (url: string) => void;
}

export function FileUploadTab({ onUploadComplete }: FileUploadTabProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const supportedFormats = {
    'application/pdf': ['.pdf'],
    'application/x-dwg': ['.dwg'],
    'application/x-dxf': ['.dxf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/svg+xml': ['.svg']
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: supportedFormats,
    onDrop: handleFileDrop,
    multiple: false
  });

  async function handleFileDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setProgress(0);
      setError(null);

      // Start upload animation
      setProgress(20);

      // Upload to floor-plan-originals bucket
      const filePath = `${crypto.randomUUID()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('floor-plan-originals')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setProgress(50);

      // Initiate conversion if needed
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        const { data: conversionData, error: conversionError } = await supabase.functions
          .invoke('convert-floor-plan', {
            body: { 
              fileUrl: filePath,
              fileType: file.type
            }
          });

        if (conversionError) throw conversionError;
        setProgress(75);
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('floor-plan-originals')
        .getPublicUrl(filePath);

      setProgress(100);
      onUploadComplete(publicUrlData.publicUrl);
      
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Floor Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? "Drop the file here"
              : "Drag and drop your floor plan, or click to select"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: PDF, DWG, DXF, JPG, PNG, SVG
          </p>
        </div>
        
        <UploadProgress 
          isLoading={isLoading}
          progress={progress}
          error={error}
        />
      </CardContent>
    </Card>
  );
}