import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash, Calendar } from "lucide-react";

interface MarketingContent {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  scheduled_date?: string;
  platform?: string;
  metrics?: {
    views?: number;
    clicks?: number;
    conversions?: number;
  };
}

const CONTENT_TYPES = [
  "Social Post",
  "Email Campaign",
  "Blog Post",
  "Promotion",
  "Advertisement",
];

const PLATFORMS = ["Facebook", "Instagram", "LinkedIn", "Email", "Website"];

export function MarketingHub({ contractorId }: { contractorId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    content: "",
    type: "",
    platform: "",
    scheduled_date: "",
  });

  const { data: marketingContent, isLoading } = useQuery({
    queryKey: ["contractor-marketing", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_marketing")
        .select("*")
        .eq("contractor_id", contractorId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MarketingContent[];
    },
  });

  const addContent = useMutation({
    mutationFn: async (contentData: typeof newContent) => {
      const { error } = await supabase.from("contractor_marketing").insert([
        {
          ...contentData,
          contractor_id: contractorId,
          status: "draft",
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-marketing"] });
      setIsAdding(false);
      setNewContent({
        title: "",
        content: "",
        type: "",
        platform: "",
        scheduled_date: "",
      });
      toast({
        title: "Success",
        description: "Marketing content added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add marketing content",
        variant: "destructive",
      });
      console.error("Error adding marketing content:", error);
    },
  });

  const deleteContent = useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase
        .from("contractor_marketing")
        .delete()
        .eq("id", contentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-marketing"] });
      toast({
        title: "Success",
        description: "Marketing content deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete marketing content",
        variant: "destructive",
      });
      console.error("Error deleting marketing content:", error);
    },
  });

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <div className="space-y-4">
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Marketing Content
        </Button>
      )}

      {isAdding && (
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
            value={newContent.scheduled_date}
            onChange={(e) =>
              setNewContent({ ...newContent, scheduled_date: e.target.value })
            }
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={() => addContent.mutate(newContent)}>
              Add Content
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {marketingContent?.map((content) => (
          <div
            key={content.id}
            className="p-4 border rounded-lg flex justify-between items-start"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{content.title}</h3>
                <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                  {content.type}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{content.content}</p>
              {content.platform && (
                <p className="text-sm text-muted-foreground">
                  Platform: {content.platform}
                </p>
              )}
              {content.scheduled_date && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(content.scheduled_date).toLocaleString()}
                </p>
              )}
              {content.metrics && (
                <div className="text-sm text-muted-foreground mt-2">
                  <p>Views: {content.metrics.views || 0}</p>
                  <p>Clicks: {content.metrics.clicks || 0}</p>
                  <p>Conversions: {content.metrics.conversions || 0}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteContent.mutate(content.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}