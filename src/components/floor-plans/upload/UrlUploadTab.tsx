import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";

interface UrlUploadTabProps {
  onUrlSubmit: (url: string) => void;
}

export function UrlUploadTab({ onUrlSubmit }: UrlUploadTabProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    
    try {
      onUrlSubmit(url);
      setProgress(100);
      toast({
        title: "Success",
        description: "Floor plan URL added successfully",
      });
    } catch (error) {
      console.error('Error processing floor plan URL:', error);
      toast({
        title: "Error",
        description: "Failed to process floor plan URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Floor Plan URL</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/floor-plan.jpg"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !url}
            className="w-full"
          >
            <Link2 className="h-4 w-4 mr-2" />
            Add URL
          </Button>
          {isLoading && (
            <Progress value={progress} className="w-full" />
          )}
        </form>
      </CardContent>
    </Card>
  );
}