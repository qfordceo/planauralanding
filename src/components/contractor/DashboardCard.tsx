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
}

export function DashboardCard({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  onClick,
  children,
  expanded = false
}: DashboardCardProps) {
  return (
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
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