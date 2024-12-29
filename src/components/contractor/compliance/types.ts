export type DocumentType = 
  | "license"
  | "insurance"
  | "certification"
  | "permit"
  | "tax_document"
  | "background_check"
  | "safety_certification"
  | "bond";

export interface ComplianceDocument {
  id: string;
  contractor_id: string;
  document_type: DocumentType;
  document_number: string | null;
  issuing_authority: string | null;
  issue_date: string | null;
  expiration_date: string | null;
  verification_status: 'pending' | 'verified' | 'rejected' | 'expired';
  verification_notes: string | null;
  document_url: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentFormData {
  document_type: DocumentType;
  document_number?: string;
  issuing_authority?: string;
  expiration_date?: string;
  file: File;
}