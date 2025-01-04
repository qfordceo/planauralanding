import { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireContractor?: boolean;
  fallbackPath?: string;
}

export function RoleGuard({ 
  children, 
  requireAdmin, 
  requireContractor,
  fallbackPath = "/dashboard"
}: RoleGuardProps) {
  const { isAdmin, isContractor } = usePermissions();
  const { toast } = useToast();

  if (requireAdmin && !isAdmin) {
    toast({
      title: "Access Denied",
      description: "You need administrator privileges to access this area.",
      variant: "destructive",
    });
    return <Navigate to={fallbackPath} replace />;
  }

  if (requireContractor && !isContractor) {
    toast({
      title: "Access Denied",
      description: "You need contractor privileges to access this area.",
      variant: "destructive",
    });
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}