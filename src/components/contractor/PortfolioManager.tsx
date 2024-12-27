import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Image, Loader2, Plus, Trash } from "lucide-react";

const portfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  completed_date: z.string().min(1, "Completion date is required"),
  image: z.instanceof(File).optional(),
});

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  completed_date: string;
  image_url: string;
};

export function PortfolioManager({ contractorId }: { contractorId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: {
      title: "",
      description: "",
      completed_date: "",
    },
  });

  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ["portfolio", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_portfolio")
        .select("*")
        .eq("contractor_id", contractorId);

      if (error) throw error;
      return data as PortfolioItem[];
    },
  });

  const addPortfolioItem = useMutation({
    mutationFn: async (values: z.infer<typeof portfolioItemSchema>) => {
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
      form.reset();
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

  const onSubmit = async (values: z.infer<typeof portfolioItemSchema>) => {
    setIsUploading(true);
    try {
      await addPortfolioItem.mutateAsync(values);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Portfolio Item</CardTitle>
          <CardDescription>
            Showcase your completed projects to potential clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completed_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Project Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image of your completed project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUploading} className="w-full">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Project
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {item.title}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePortfolioItem.mutate(item.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.image_url && (
                <div className="relative aspect-video">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="rounded-md object-cover w-full h-full"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <p className="text-sm text-muted-foreground">
                Completed: {new Date(item.completed_date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}