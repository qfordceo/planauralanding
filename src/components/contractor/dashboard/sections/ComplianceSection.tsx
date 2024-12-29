import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceDocuments } from "../../compliance/ComplianceDocuments";
import { FileCheck } from "lucide-react";

interface ComplianceSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function ComplianceSection({
  contractorId,
  activeSection,
  setActiveSection,
}: ComplianceSectionProps) {
  const isActive = activeSection === "compliance";

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setActiveSection(isActive ? null : "compliance")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Compliance & Documentation</CardTitle>
        <FileCheck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isActive && (
          <ComplianceDocuments contractorId={contractorId} />
        )}
      </CardContent>
    </Card>
  );
}