import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AgreementDisplayProps {
  title: string;
  content: React.ReactNode;
  onDownload?: () => void;
  className?: string;
}

export function AgreementDisplay({ 
  title, 
  content, 
  onDownload,
  className = "" 
}: AgreementDisplayProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {onDownload && (
          <Button variant="outline" size="icon" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
          {content}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}