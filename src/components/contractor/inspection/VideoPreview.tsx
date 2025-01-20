import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface VideoPreviewProps {
  url: string;
  onClear: () => void;
}

export function VideoPreview({ url, onClear }: VideoPreviewProps) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <video
        src={url}
        controls
        className="w-full"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onClear}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}