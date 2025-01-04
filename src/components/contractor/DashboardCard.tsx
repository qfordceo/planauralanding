import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { AIInsights } from "./AIInsights";

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
  aiData?: any;
  aiSection?: string;
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
  visibility,
  aiData,
  aiSection
}: DashboardCardProps) {
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${expanded ? 'col-span-full' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-muted-foreground" />
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
            <AIInsights aiData={aiData} aiSection={aiSection} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!expanded && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {description}
            </p>
            <Button 
              onClick={onClick}
              className="w-full"
              variant={expanded ? "outline" : "default"}
            >
              {buttonText}
            </Button>
          </>
        )}
        {expanded && children}
      </CardContent>
    </Card>
  );
}