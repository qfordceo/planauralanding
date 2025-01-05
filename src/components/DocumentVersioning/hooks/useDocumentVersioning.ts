import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DocumentVersion } from "@/types/documents";

export function useDocumentVersioning(documentId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: versions, isLoading } = useQuery({
    queryKey: ['document-versions', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data as DocumentVersion[];
    }
  });

  const createVersion = useMutation({
    mutationFn: async (file: File) => {
      const currentVersion = versions?.[0]?.version_number || 0;
      const newVersion = currentVersion + 1;

      const fileExt = file.name.split('.').pop();
      const filePath = `${documentId}/${newVersion}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(filePath, file);

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
    onError: (error) => {
      console.error('Error creating version:', error);
      toast({
        title: "Error",
        description: "Failed to create new version",
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
    onError: (error) => {
      console.error('Error reverting version:', error);
      toast({
        title: "Error",
        description: "Failed to revert document",
        variant: "destructive",
      });
    },
  });

  return {
    versions,
    isLoading,
    createVersion: createVersion.mutate,
    revertVersion: revertVersion.mutate,
    isCreating: createVersion.isPending,
    isReverting: revertVersion.isPending,
  };
}