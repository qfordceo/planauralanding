import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloorPlanViewer } from "@/components/floor-plans/visualization/FloorPlanViewer";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AsBuiltModelViewerProps {
  modelId: string;
}

export function AsBuiltModelViewer({ modelId }: AsBuiltModelViewerProps) {
  const { toast } = useToast();

  const { data: model, isLoading } = useQuery({
    queryKey: ['bim-model', modelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bim_models')
        .select(`
          *,
          floor_plans (
            name,
            square_feet
          ),
          bim_materials (*)
        `)
        .eq('id', modelId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('bim-models')
        .download(`${modelId}/as-built.ifc`);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `as-built-${model?.floor_plans?.name || modelId}.ifc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Model downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download model",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!model) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Model not found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>As-Built Model: {model.floor_plans?.name}</CardTitle>
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download IFC
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <FloorPlanViewer
          sceneData={{
            walls: model.model_data?.walls || [],
            rooms: model.model_data?.rooms || [],
            bimModelId: model.id
          }}
        />
        
        {model.bim_materials && model.bim_materials.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Materials Used</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {model.bim_materials.map((material) => (
                <Card key={material.id} className="p-4">
                  <h4 className="font-medium">{material.material_type}</h4>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {material.quantity} {material.unit}
                  </p>
                  {material.specifications && (
                    <p className="text-sm mt-2">
                      {material.specifications.description}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}