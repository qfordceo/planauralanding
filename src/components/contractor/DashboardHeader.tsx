import { MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Contractor } from "@/types/contractor";

interface DashboardHeaderProps {
  contractor: Contractor;
  onSignOut: () => void;
}

export function DashboardHeader({ contractor, onSignOut }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome, {contractor?.business_name}!</h1>
          {contractor?.address && (
            <div className="flex items-center text-muted-foreground mb-1">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{contractor.address}</span>
            </div>
          )}
        </div>
        <Button variant="ghost" onClick={onSignOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}