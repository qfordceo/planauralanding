import { useState } from "react";
import { useDocumentVersioning } from "./hooks/useDocumentVersioning";
import { VersionList } from "./components/VersionList";
import { VersionDiff } from "./components/VersionDiff";
import { VersionControls } from "./components/VersionControls";
import { DocumentVersion } from "@/types/documents";
import { Card } from "@/components/ui/card";

interface DocumentVersioningProps {
  documentId: string;
}

export function DocumentVersioning({ documentId }: DocumentVersioningProps) {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const { versions, isLoading, createVersion, revertVersion, isCreating, isReverting } = useDocumentVersioning(documentId);

  const currentVersion = versions?.[0];
  const previousVersion = selectedVersion 
    ? versions?.find(v => v.version_number === selectedVersion) || null
    : versions?.[1] || null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await createVersion(file);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Document Versions</h2>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <VersionControls
              onCreateVersion={() => document.getElementById('file-upload')?.click()}
              onRevertVersion={(version: number) => revertVersion(version)}
              canCreateVersion={true}
              canRevertVersion={!!selectedVersion && selectedVersion !== currentVersion?.version_number}
              isLoading={isCreating || isReverting}
            />
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Version History</h3>
              <VersionList
                versions={versions || []}
                currentVersion={currentVersion?.version_number || 1}
                onVersionSelect={setSelectedVersion}
                isLoading={isLoading}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Changes</h3>
              {currentVersion && previousVersion && (
                <VersionDiff
                  previousVersion={previousVersion}
                  currentVersion={currentVersion}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}