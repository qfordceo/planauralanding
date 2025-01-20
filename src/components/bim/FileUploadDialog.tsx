import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileType, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SUPPORTED_FORMATS = {
  'application/x-dwg': 'DWG',
  'application/x-ifc': 'IFC',
  'application/x-rvt': 'RVT'
};

export function FileUploadDialog() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type || `application/x-${file.name.split('.').pop()}`;
    if (!Object.keys(SUPPORTED_FORMATS).includes(fileType)) {
      toast({
        title: "Unsupported file format",
        description: "Please upload a DWG, IFC, or RVT file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const filePath = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('bim-models')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('bim-models')
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) throw new Error('Failed to get public URL');

      // Process the file based on its format
      const processingEndpoint = fileType === 'application/x-dwg' 
        ? 'process-dwg-file' 
        : 'process-bim-file';

      const { data, error } = await supabase.functions.invoke(processingEndpoint, {
        body: { 
          fileUrl: urlData.publicUrl,
          metadata: {
            originalName: file.name,
            size: file.size,
            type: fileType
          }
        }
      });

      if (error) throw error;

      toast({
        title: "File uploaded successfully",
        description: "Your BIM file has been processed and is ready to view",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload BIM File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload BIM File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Info className="h-4 w-4" />
              Supported formats:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(SUPPORTED_FORMATS).map((format) => (
                <div key={format} className="bg-background px-3 py-1 rounded text-sm font-mono">
                  .{format.toLowerCase()}
                </div>
              ))}
            </div>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <input
              type="file"
              accept=".dwg,.ifc,.rvt"
              className="hidden"
              id="bim-file-upload"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label
              htmlFor="bim-file-upload"
              className="cursor-pointer bg-muted hover:bg-muted/80 transition-colors rounded-lg p-8 text-center"
            >
              {isUploading ? (
                <div className="animate-pulse">Uploading...</div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    Click to select or drag and drop your BIM file
                  </div>
                </>
              )}
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}