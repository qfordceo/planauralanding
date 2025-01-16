import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface AsBuiltModelsListProps {
  onSelectModel: (modelId: string) => void;
}

export function AsBuiltModelsList({ onSelectModel }: AsBuiltModelsListProps) {
  const { data: models, isLoading } = useQuery({
    queryKey: ['as-built-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bim_models')
        .select(`
          *,
          floor_plans (
            name,
            square_feet
          )
        `)
        .eq('is_as_built', true)
        .order('as_built_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!models?.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No as-built models available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {models.map((model) => (
        <Card key={model.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{model.floor_plans?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Completed: {format(new Date(model.as_built_date), 'PPP')}
              </p>
            </div>
            <Button onClick={() => onSelectModel(model.id)} variant="ghost">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}