export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_path: string;
  created_by: string | null;
  created_at: string;
  metadata: Record<string, any>;
}

export interface Document {
  id: string;
  title: string;
  content_type: string;
  current_version: number;
}