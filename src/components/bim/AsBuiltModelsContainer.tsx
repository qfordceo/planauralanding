import { useState } from "react";
import { AsBuiltModelsList } from "./AsBuiltModelsList";
import { AsBuiltModelViewer } from "./AsBuiltModelViewer";
import { Button } from "@/components/ui/button";

export function AsBuiltModelsContainer() {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">As-Built Models</h1>
      
      {selectedModelId ? (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedModelId(null)}
            className="mb-4"
          >
            ← Back to List
          </Button>
          <AsBuiltModelViewer modelId={selectedModelId} />
        </div>
      ) : (
        <AsBuiltModelsList onSelectModel={setSelectedModelId} />
      )}
    </div>
  );
}