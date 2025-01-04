import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { ErrorBoundary as BaseErrorBoundary } from "@/components/ErrorBoundary";

export function WorkflowErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <BaseErrorBoundary>
      {children}
    </BaseErrorBoundary>
  );
}