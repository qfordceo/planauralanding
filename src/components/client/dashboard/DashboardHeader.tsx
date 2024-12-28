import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Profile } from "@/types/profile";

interface DashboardHeaderProps {
  isLoading: boolean;
  error?: any;
}

export function DashboardHeader({ isLoading, error }: DashboardHeaderProps) {
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Progress value={30} className="w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <h1 className="text-4xl font-bold mb-8">Client Dashboard</h1>
  );
}