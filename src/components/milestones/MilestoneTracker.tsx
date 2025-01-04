import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Calendar,
  CheckCircle,
  Image as ImageIcon,
  Plus
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface MilestoneTrackerProps {
  projectId: string;
}

export function MilestoneTracker({ projectId }: MilestoneTrackerProps) {
  const { toast } = useToast();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const { data: milestones, isLoading } = useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select(`
          *,
          milestone_updates (
            *
          )
        `)
        .eq('build_estimate_id', projectId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const handlePhotoUpload = async (milestoneId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${milestoneId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('milestone-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('milestone_updates')
        .insert({
          milestone_id: milestoneId,
          update_type: 'photo',
          photos: [filePath]
        });

      if (updateError) throw updateError;

      toast({
        title: "Photo uploaded successfully",
        description: "The milestone has been updated with the new photo.",
      });
    } catch (error) {
      toast({
        title: "Error uploading photo",
        description: "Please try again later.",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Project Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {milestones?.map((milestone) => (
              <Card key={milestone.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(milestone.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={milestone.status === 'completed' ? 'default' : 'outline'}>
                    {milestone.status}
                  </Badge>
                </div>

                {milestone.milestone_updates?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {milestone.milestone_updates.map((update) => (
                      <div key={update.id} className="flex items-center gap-2 text-sm">
                        {update.update_type === 'photo' ? (
                          <ImageIcon className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span>{new Date(update.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          handlePhotoUpload(milestone.id, file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}