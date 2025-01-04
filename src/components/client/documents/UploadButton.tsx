import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  acceptedTypes: string;
}

export function UploadButton({ onUpload, acceptedTypes }: UploadButtonProps) {
  return (
    <Button variant="outline" className="flex items-center gap-2">
      <Upload className="h-4 w-4" />
      <label className="cursor-pointer">
        Upload Document
        <input
          type="file"
          className="hidden"
          onChange={onUpload}
          accept={acceptedTypes}
        />
      </label>
    </Button>
  );
}