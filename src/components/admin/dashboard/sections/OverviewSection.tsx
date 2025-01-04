import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, FileCheck } from "lucide-react";

interface OverviewSectionProps {
  totalProjects: number;
  pendingApprovals: number;
}

export function OverviewSection({ totalProjects, pendingApprovals }: OverviewSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Total Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalProjects}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{pendingApprovals}</p>
        </CardContent>
      </Card>
    </div>
  );
}