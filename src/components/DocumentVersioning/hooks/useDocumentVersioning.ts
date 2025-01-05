import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DocumentVersion } from "@/types/documents";

export function useDocumentVersioning(documentId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: versions, isLoading, error: fetchError } = useQuery({
    queryKey: ['document-versions', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching versions",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data as DocumentVersion[];
    }
  });

  const createVersion = useMutation({
    mutationFn: async (file: File) => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('File size exceeds 50MB limit');
      }

      const currentVersion = versions?.[0]?.version_number || 0;
      const newVersion = currentVersion + 1;

      const fileExt = file.name.split('.').pop();
      const filePath = `${documentId}/${newVersion}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { error: versionError } = await supabase
        .from('document_versions')
        .insert({
          document_id: documentId,
          version_number: newVersion,
          file_path: filePath,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          metadata: {
            original_name: file.name,
            size: file.size,
            type: file.type,
          },
        });

      if (versionError) throw versionError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-versions'] });
      toast({
        title: "Success",
        description: "New version created successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error creating version:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create new version",
        variant: "destructive",
      });
    },
  });

  const revertVersion = useMutation({
    mutationFn: async (version: number) => {
      const versionToRevert = versions?.find(v => v.version_number === version);
      if (!versionToRevert) throw new Error('Version not found');

      const { error: updateError } = await supabase
        .from('project_contracts')
        .update({ current_version: version })
        .eq('id', documentId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-versions'] });
      toast({
        title: "Success",
        description: "Document reverted successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error reverting version:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to revert document",
        variant: "destructive",
      });
    },
  });

  return {
    versions,
    isLoading,
    error: fetchError,
    createVersion: createVersion.mutate,
    revertVersion: revertVersion.mutate,
    isCreating: createVersion.isPending,
    isReverting: revertVersion.isPending,
  };
}