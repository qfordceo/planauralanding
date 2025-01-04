import { FileText, File, FileImage } from "lucide-react";

export const ALLOWED_FILE_TYPES = {
  'application/pdf': { icon: FileText, label: 'PDF' },
  'image/jpeg': { icon: FileImage, label: 'Image' },
  'image/png': { icon: FileImage, label: 'Image' },
  'application/zip': { icon: File, label: 'Archive' },
  'application/x-zip-compressed': { icon: File, label: 'Archive' },
  'application/msword': { icon: FileText, label: 'Document' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'Document' },
} as const;