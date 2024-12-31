import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileUploadTab } from './floor-plans/upload/FileUploadTab';
import { UrlUploadTab } from './floor-plans/upload/UrlUploadTab';
import { FloorPlanPreview } from './floor-plans/preview/FloorPlanPreview';

export const FloorPlanScraper = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

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
        <FloorPlanPreview imageUrl={uploadedImageUrl} />
      )}
    </div>
  );
};