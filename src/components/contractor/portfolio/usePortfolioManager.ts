import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FormData } from "./types";

export function usePortfolioManager(contractorId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ["portfolio", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_portfolio")
        .select("*")
        .eq("contractor_id", contractorId);

      if (error) throw error;
      return data;
    },
  });

  const addPortfolioItem = useMutation({
    mutationFn: async (values: FormData) => {
      let imageUrl = "";
      
      if (values.image) {
        const fileExt = values.image.name.split(".").pop();
        const filePath = `${contractorId}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("contractor-portfolio")
          .upload(filePath, values.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("contractor-portfolio")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("contractor_portfolio").insert({
        contractor_id: contractorId,
        title: values.title,
        description: values.description,
        completed_date: values.completed_date,
        image_url: imageUrl,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", contractorId] });
      toast({
        title: "Success",
        description: "Portfolio item added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add portfolio item",
        variant: "destructive",
      });
      console.error("Error adding portfolio item:", error);
    },
  });

  const deletePortfolioItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contractor_portfolio")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", contractorId] });
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      });
      console.error("Error deleting portfolio item:", error);
    },
  });

  const handleSubmit = async (values: FormData) => {
    setIsUploading(true);
    try {
      await addPortfolioItem.mutateAsync(values);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    portfolioItems,
    isLoading,
    isUploading,
    handleSubmit,
    handleDelete: deletePortfolioItem.mutate,
  };
}