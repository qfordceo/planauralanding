import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";

interface UploadButtonProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  acceptedTypes: string;
}

export function UploadButton({ onUpload, acceptedTypes }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    try {
      await onUpload(event);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button variant="outline" className="flex items-center gap-2" disabled={isUploading}>
      {isUploading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Upload className="h-4 w-4" />
      )}
      <label className="cursor-pointer">
        Upload Document
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept={acceptedTypes}
          disabled={isUploading}
        />
      </label>
    </Button>
  );
}