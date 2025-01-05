import { FileText, File, FileImage, LucideIcon } from "lucide-react";

interface FileTypeConfig {
  icon: LucideIcon;
  description: string;
}

export const ALLOWED_FILE_TYPES: Record<string, FileTypeConfig> = {
  'application/pdf': {
    icon: FileText,
    description: 'PDF Document'
  },
  'image/jpeg': {
    icon: FileImage,
    description: 'JPEG Image'
  },
  'image/png': {
    icon: FileImage,
    description: 'PNG Image'
  },
  'image/jpg': {
    icon: FileImage,
    description: 'JPG Image'
  },
  'application/msword': {
    icon: FileText,
    description: 'Word Document'
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    icon: FileText,
    description: 'Word Document'
  }
};