import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick: () => void;
  children?: ReactNode;
  expanded?: boolean;
  badge?: {
    count: number;
    variant: "default" | "destructive" | "warning";
  };
  visibility?: "public" | "private";
}

export function DashboardCard({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  onClick,
  children,
  expanded = false,
  badge,
  visibility
}: DashboardCardProps) {
  return (
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
          <div className="ml-auto flex items-center gap-2">
            {visibility && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                visibility === "public" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {visibility === "public" ? "Public" : "Private"}
              </span>
            )}
            {badge && (
              <span className={`px-2 py-1 text-xs rounded-full bg-${badge.variant} text-${badge.variant}-foreground`}>
                {badge.count}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!expanded && (
          <>
            <p className="text-muted-foreground mb-4">
              {description}
            </p>
            <Button onClick={onClick}>{buttonText}</Button>
          </>
        )}
        {expanded && children}
      </CardContent>
    </Card>
  );
}