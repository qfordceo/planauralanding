import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTENT_TYPES, PLATFORMS } from "./marketingConstants";
import { format } from "date-fns";

interface MarketingFormProps {
  onSubmit: (contentData: any) => void;
  onCancel: () => void;
}

export function MarketingForm({ onSubmit, onCancel }: MarketingFormProps) {
  const [newContent, setNewContent] = useState({
    title: "",
    content: "",
    type: "",
    platform: "",
    scheduled_date: "",
  });

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localDateTime = e.target.value;
    // Convert local datetime to UTC for storage
    const utcDate = new Date(localDateTime);
    setNewContent({ ...newContent, scheduled_date: utcDate.toISOString() });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <Input
        placeholder="Title"
        value={newContent.title}
        onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
      />
      <Textarea
        placeholder="Content"
        value={newContent.content}
        onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
      />
      <Select
        value={newContent.type}
        onValueChange={(value) => setNewContent({ ...newContent, type: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          {CONTENT_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={newContent.platform}
        onValueChange={(value) =>
          setNewContent({ ...newContent, platform: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          {PLATFORMS.map((platform) => (
            <SelectItem key={platform} value={platform}>
              {platform}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="datetime-local"
        value={newContent.scheduled_date ? format(new Date(newContent.scheduled_date), "yyyy-MM-dd'T'HH:mm") : getCurrentDateTime()}
        onChange={handleDateTimeChange}
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSubmit(newContent)}>Add Content</Button>
      </div>
    </div>
  );
}