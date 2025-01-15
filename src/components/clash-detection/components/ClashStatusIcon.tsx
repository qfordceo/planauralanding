import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface ClashStatusIconProps {
  status: 'resolved' | 'pending_review' | 'unresolved';
}

export function ClashStatusIcon({ status }: ClashStatusIconProps) {
  switch (status) {
    case 'resolved':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'pending_review':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'unresolved':
      return <XCircle className="h-5 w-5 text-red-500" />;
  }
}