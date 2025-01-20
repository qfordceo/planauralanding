import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Clock, FileType } from "lucide-react";
import { format } from "date-fns";

interface FileVersionListProps {
  modelId: string;
}

export function FileVersionList({ modelId }: FileVersionListProps) {
  const { data: versions, isLoading } = useQuery({
    queryKey: ['bim-versions', modelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bim_file_versions')
        .select(`
          *,
          created_by (
            email
          )
        `)
        .eq('bim_model_id', modelId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDownload = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('bim-models')
      .download(filePath);

    if (error) {
      console.error('Download error:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading versions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Version History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {versions?.map((version) => (
          <div
            key={version.id}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileType className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Version {version.version_number}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {format(new Date(version.created_at), 'PPp')}
              </div>
              {version.change_summary && (
                <div className="text-sm text-muted-foreground mt-2">
                  {version.change_summary}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(version.file_path, `v${version.version_number}.${version.file_format.toLowerCase()}`)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}