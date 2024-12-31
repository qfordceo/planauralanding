import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Link2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { FloorPlanAnalyzer } from './floor-plans/FloorPlanAnalyzer';

interface FloorPlan {
  name: string;
  bedrooms?: string;
  bathrooms?: string;
  squareFeet?: string;
  price?: string;
  imageUrl?: string;
}

export const FloorPlanScraper = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      setProgress(0);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('floor-plans')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('floor-plans')
        .getPublicUrl(fileName);

      setUploadedImageUrl(publicUrl);
      setProgress(100);
      
      toast({
        title: "Success",
        description: "Floor plan uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading floor plan:', error);
      toast({
        title: "Error",
        description: "Failed to upload floor plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    
    try {
      setUploadedImageUrl(url);
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Enter URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Floor Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
              {isLoading && (
                <Progress value={progress} className="w-full" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      {uploadedImageUrl && (
        <>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img 
                src={uploadedImageUrl} 
                alt="Uploaded floor plan" 
                className="w-full h-auto"
              />
            </CardContent>
          </Card>

          <FloorPlanAnalyzer imageUrl={uploadedImageUrl} />
        </>
      )}

      {floorPlans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {floorPlans.map((plan, index) => (
            <Card key={index} className="overflow-hidden">
              {plan.imageUrl && (
                <img 
                  src={plan.imageUrl} 
                  alt={plan.name} 
                  className="w-full h-48 object-cover"
                />
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {plan.bedrooms && (
                    <div className="flex justify-between">
                      <dt>Bedrooms:</dt>
                      <dd>{plan.bedrooms}</dd>
                    </div>
                  )}
                  {plan.bathrooms && (
                    <div className="flex justify-between">
                      <dt>Bathrooms:</dt>
                      <dd>{plan.bathrooms}</dd>
                    </div>
                  )}
                  {plan.squareFeet && (
                    <div className="flex justify-between">
                      <dt>Square Feet:</dt>
                      <dd>{plan.squareFeet}</dd>
                    </div>
                  )}
                  {plan.price && (
                    <div className="flex justify-between">
                      <dt>Price:</dt>
                      <dd>{plan.price}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};