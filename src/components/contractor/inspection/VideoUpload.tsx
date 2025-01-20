import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function VideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video must be less than 100MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Get contractor ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: contractor } = await supabase
        .from('contractors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!contractor) throw new Error('Contractor profile not found');

      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      // Upload to storage using chunks to track progress
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      let uploadedChunks = 0;

      for (let start = 0; start < file.size; start += chunkSize) {
        const chunk = file.slice(start, start + chunkSize);
        const { error: uploadError } = await supabase.storage
          .from('inspection-videos')
          .upload(`${filePath}_${start}`, chunk, {
            upsert: true
          });

        if (uploadError) throw uploadError;
        
        uploadedChunks++;
        const progressPercent = (uploadedChunks / totalChunks) * 100;
        setProgress(progressPercent);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('inspection-videos')
        .getPublicUrl(filePath);

      // Create database entry
      const { error: dbError } = await supabase
        .from('inspection_videos')
        .insert({
          contractor_id: contractor.id,
          original_filename: file.name,
          storage_path: filePath,
          file_size: file.size,
          format: file.type
        });

      if (dbError) throw dbError;

      // Trigger video processing
      const { error: processingError } = await supabase.functions.invoke('process-inspection-video', {
        body: { filePath, contractorId: contractor.id }
      });

      if (processingError) throw processingError;

      toast({
        title: "Upload successful",
        description: "Your video is being processed",
      });

      setVideoPreview(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
        ) : (
          <Upload className="h-12 w-12 mx-auto text-gray-400" />
        )}
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the video here"
            : "Drag and drop a video, or click to select"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: MP4, MOV, AVI, MKV (max 100MB)
        </p>
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}

      {videoPreview && !uploading && (
        <div className="relative rounded-lg overflow-hidden">
          <video
            src={videoPreview}
            controls
            className="w-full"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setVideoPreview(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}