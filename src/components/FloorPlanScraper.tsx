import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileUploadTab } from './floor-plans/upload/FileUploadTab';
import { UrlUploadTab } from './floor-plans/upload/UrlUploadTab';
import { FloorPlanPreview } from './floor-plans/preview/FloorPlanPreview';
import { FloorPlanViewer } from './floor-plans/visualization/FloorPlanViewer';
import { ComplianceChecker } from './compliance/ComplianceChecker';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const FloorPlanScraper = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const { data: visualizationData, isLoading: isVisualizationLoading } = useQuery({
    queryKey: ['floor-plan-visualization', uploadedImageUrl],
    queryFn: async () => {
      if (!uploadedImageUrl) return null;

      const response = await supabase.functions.invoke('analyze-floor-plan', {
        body: { imageUrl: uploadedImageUrl }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!uploadedImageUrl
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Enter URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <FileUploadTab onUploadComplete={setUploadedImageUrl} />
        </TabsContent>

        <TabsContent value="url">
          <UrlUploadTab onUrlSubmit={setUploadedImageUrl} />
        </TabsContent>
      </Tabs>

      {uploadedImageUrl && (
        <div className="space-y-8">
          <FloorPlanPreview imageUrl={uploadedImageUrl} />
          <FloorPlanViewer 
            sceneData={visualizationData} 
            isLoading={isVisualizationLoading} 
          />
          <ComplianceChecker floorPlanId={visualizationData?.id} />
        </div>
      )}
    </div>
  );
}