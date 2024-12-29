import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  onCancel: () => void;
}

export function FileUpload({ onUploadComplete, onCancel }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Button variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}