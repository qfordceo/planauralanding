import { UploadProgress } from './UploadProgress';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface FileUploadProgressProps {
  file: File;
  onComplete: (url: string) => void;
}

export function FileUploadProgress({ file, onComplete }: FileUploadProgressProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uploadFile = async () => {
      setIsLoading(true);
      setProgress(0);
      setError(null);

      try {
        const filePath = `${crypto.randomUUID()}-${file.name}`;
        
        // Upload to floor-plan-originals bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('floor-plan-originals')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

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
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('floor-plan-originals')
          .getPublicUrl(filePath);

        onComplete(publicUrlData.publicUrl);
        
        toast({
          title: "Success",
          description: "Floor plan uploaded successfully",
        });

        setProgress(100);
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

    uploadFile();
  }, [file, onComplete, toast]);

  return (
    <UploadProgress 
      isLoading={isLoading}
      progress={progress}
      error={error}
    />
  );
}