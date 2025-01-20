import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function VideoList() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ['inspection-videos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: contractor } = await supabase
        .from('contractors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!contractor) throw new Error('Contractor profile not found');

      const { data, error } = await supabase
        .from('inspection_videos')
        .select('*')
        .eq('contractor_id', contractor.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="text-center">Loading videos...</div>;
  }

  if (!videos?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No videos uploaded yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Card key={video.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {video.original_filename}
            </CardTitle>
            {video.processing_status === 'pending' ? (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            ) : (
              <Video className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Uploaded on {format(new Date(video.created_at), 'PPP')}
            </div>
            <div className="text-sm text-muted-foreground">
              Status: {video.processing_status}
            </div>
            {video.processing_error && (
              <div className="text-sm text-red-500 mt-2">
                Error: {video.processing_error}
              </div>
            )}
            {video.processing_status === 'completed' && (
              <video
                src={supabase.storage
                  .from('inspection-videos')
                  .getPublicUrl(video.storage_path.replace(/\.[^/.]+$/, '_processed.mp4'))
                  .data.publicUrl}
                controls
                className="mt-4 w-full rounded-lg"
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}