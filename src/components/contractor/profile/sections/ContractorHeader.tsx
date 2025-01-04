import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Contractor } from "@/types/contractor";

interface ContractorHeaderProps {
  contractor: Contractor;
}

export function ContractorHeader({ contractor }: ContractorHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-2xl font-bold">{contractor.business_name}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {contractor.contact_name}
        </p>
      </div>
      {contractor.insurance_verified && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4" />
          Insurance Verified
        </Badge>
      )}
    </div>
  );
}