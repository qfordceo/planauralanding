import { useState, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GuideForm } from "./guide-editor/GuideForm";
import { useGuideData } from "./guide-editor/useGuideData";
import { type Guide } from "./guide-editor/types";

interface GuideEditorProps {
  guideId: string | null;
  onClose: () => void;
}

export function GuideEditor({ guideId, onClose }: GuideEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { guide, isLoading } = useGuideData(guideId);

  const saveGuide = useMutation({
    mutationFn: async (guideData: Guide) => {
      const { data, error } = await supabase
        .from('documentation_guides')
        .upsert([guideData]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation-guides'] });
      toast({
        title: "Success",
        description: `Guide ${guideId ? 'updated' : 'created'} successfully`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save guide: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {guideId ? 'Edit Guide' : 'Create New Guide'}
      </h2>
      <GuideForm 
        initialData={guide}
        onSubmit={(data) => saveGuide.mutate(data)}
        onCancel={onClose}
      />
    </Card>
  );
}