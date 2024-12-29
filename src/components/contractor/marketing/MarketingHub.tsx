import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MarketingForm } from "./MarketingForm";
import { MarketingList } from "./MarketingList";
import type { MarketingContent } from "./types";

export function MarketingHub({ contractorId }: { contractorId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

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
    mutationFn: async (contentData: any) => {
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
        <MarketingForm
          onSubmit={(data) => addContent.mutate(data)}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <MarketingList
        content={marketingContent || []}
        onDelete={(id) => deleteContent.mutate(id)}
      />
    </div>
  );
}