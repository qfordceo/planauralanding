import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VideoUploadForm } from './VideoUploadForm';
import { VideoPreview } from './VideoPreview';
import { UploadProgress } from './UploadProgress';

export function VideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
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
    } catch (error: any) {
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
  };

  return (
    <div className="space-y-4">
      <VideoUploadForm 
        onUpload={handleUpload}
        uploading={uploading}
      />

      {uploading && <UploadProgress progress={progress} />}

      {videoPreview && !uploading && (
        <VideoPreview
          url={videoPreview}
          onClear={() => setVideoPreview(null)}
        />
      )}
    </div>
  );
}