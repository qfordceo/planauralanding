import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";

interface MilestoneUpdateProps {
  milestoneId: string;
  onUpdateComplete: () => void;
}

export function MilestoneUpdate({ milestoneId, onUpdateComplete }: MilestoneUpdateProps) {
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${milestoneId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('milestone-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('milestone-photos')
        .getPublicUrl(filePath);

      // Add the update with the photo URL
      await supabase.from('milestone_updates').insert({
        milestone_id: milestoneId,
        content,
        photos: [publicUrl],
        updater_id: (await supabase.auth.getUser()).data.user?.id
      });

      toast({
        title: "Update submitted",
        description: "Your update and photo have been uploaded successfully.",
      });

      setContent("");
      onUpdateComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your update. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitUpdate = async () => {
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase.from('milestone_updates').insert({
        milestone_id: milestoneId,
        content,
        updater_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      toast({
        title: "Update submitted",
        description: "Your update has been submitted successfully.",
      });

      setContent("");
      onUpdateComplete();
    } catch (error) {
      console.error('Error submitting update:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your update. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Progress Update</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the progress made..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex items-center gap-4">
          <input
            type="file"
            id="photo"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <Button
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById("photo")?.click()}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Progress Photo
          </Button>
          <Button 
            onClick={handleSubmitUpdate} 
            disabled={!content.trim() || submitting}
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Submit Update"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}