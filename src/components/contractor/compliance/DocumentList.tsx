import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { FileText, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import type { ComplianceDocument } from "@/types/compliance";

interface DocumentListProps {
  documents: ComplianceDocument[];
  onStatusChange: () => void;
}

export function DocumentList({ documents, onStatusChange }: DocumentListProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", icon: any }> = {
      pending: { variant: "outline", icon: Clock },
      verified: { variant: "secondary", icon: CheckCircle },
      rejected: { variant: "destructive", icon: XCircle },
      expired: { variant: "destructive", icon: AlertTriangle },
    };

    const { variant, icon: Icon } = variants[status] || variants.pending;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  if (!documents.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No compliance documents uploaded yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Document Number</TableHead>
          <TableHead>Expiration</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="capitalize">{doc.document_type.replace('_', ' ')}</span>
            </TableCell>
            <TableCell>{doc.document_number || 'N/A'}</TableCell>
            <TableCell>
              {doc.expiration_date 
                ? format(new Date(doc.expiration_date), 'MMM d, yyyy')
                : 'N/A'
              }
            </TableCell>
            <TableCell>{getStatusBadge(doc.verification_status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}