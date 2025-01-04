import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function MessageInput({ message, onChange, onSend }: MessageInputProps) {
  return (
    <div className="flex gap-4">
      <Textarea
        value={message}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message here..."
        className="flex-1"
      />
      <Button onClick={onSend} className="flex-shrink-0">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}