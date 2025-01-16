import { useState } from "react";
import { AsBuiltModelsList } from "./AsBuiltModelsList";
import { AsBuiltModelViewer } from "./AsBuiltModelViewer";
import { MaintenanceTracker } from "./maintenance/MaintenanceTracker";
import { MaintenanceNotifications } from "./maintenance/MaintenanceNotifications";

export function AsBuiltModelsContainer() {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <MaintenanceNotifications />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedModelId ? (
          <>
            <AsBuiltModelViewer modelId={selectedModelId} />
            <MaintenanceTracker modelId={selectedModelId} />
          </>
        ) : (
          <AsBuiltModelsList onSelectModel={setSelectedModelId} />
        )}
      </div>
    </div>
  );
}