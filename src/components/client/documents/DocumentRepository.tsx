import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DocumentList } from "./DocumentList";
import { SearchBar } from "../communication/SearchBar";
import { UploadButton } from "./UploadButton";
import { useDocumentRepository } from "./hooks/useDocumentRepository";
import { ALLOWED_FILE_TYPES } from "@/constants/fileTypes";

interface DocumentRepositoryProps {
  projectId: string;
}

export function DocumentRepository({ projectId }: DocumentRepositoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { documents, isLoading, uploadDocument, downloadVersion } = useDocumentRepository(projectId);

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Project Documents</span>
            <UploadButton 
              onUpload={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadDocument(file);
              }}
              acceptedTypes={Object.keys(ALLOWED_FILE_TYPES).join(',')}
            />
          </CardTitle>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </CardHeader>
        <CardContent>
          <DocumentList 
            documents={documents || []} 
            searchTerm={searchTerm} 
            isLoading={isLoading}
            onDownloadVersion={downloadVersion}
          />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}