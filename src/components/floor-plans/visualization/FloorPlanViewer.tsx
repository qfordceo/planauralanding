import { useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ClashDetectionReport } from "@/components/clash-detection/ClashDetectionReport";
import * as THREE from 'three';
import { Scene } from './scene/Scene';
import { ViewerControls } from './controls/ViewerControls';

interface FloorPlanViewerProps {
  sceneData?: {
    walls: Array<{
      start: { x: number; y: number };
      end: { x: number; y: number };
      height: number;
    }>;
    rooms: Array<{
      points: Array<{ x: number; y: number }>;
      height: number;
    }>;
    bimModelId?: string;
  };
  isLoading?: boolean;
}

export function FloorPlanViewer({ sceneData, isLoading }: FloorPlanViewerProps) {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [measurementMode, setMeasurementMode] = useState<'none' | 'distance' | 'area'>('none');
  const [layers, setLayers] = useState<{ [key: string]: THREE.Group }>({});

  const handleSceneReady = useCallback((
    newScene: THREE.Scene, 
    newCamera: THREE.PerspectiveCamera, 
    newRenderer: THREE.WebGLRenderer
  ) => {
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
  }, []);

  const handleLayerToggle = useCallback((layerName: string, enabled: boolean) => {
    if (layers[layerName]) {
      layers[layerName].visible = enabled;
    }
  }, [layers]);

  const handleLightingChange = useCallback((intensity: number) => {
    if (scene) {
      scene.traverse((object) => {
        if (object instanceof THREE.Light) {
          object.intensity = intensity;
        }
      });
    }
  }, [scene]);

  const handleShadowsToggle = useCallback((enabled: boolean) => {
    if (renderer) {
      renderer.shadowMap.enabled = enabled;
      scene?.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = enabled;
          object.receiveShadow = enabled;
        }
      });
    }
  }, [renderer, scene]);

  const handleExport = useCallback(async (format: string) => {
    if (!scene || !camera) return;
    
    if (format === 'png' && renderer) {
      const dataUrl = renderer.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'floor-plan.png';
      link.href = dataUrl;
      link.click();
    }
  }, [scene, camera, renderer]);

  if (isLoading) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    );
  }

  if (!sceneData || (!sceneData.walls?.length && !sceneData.rooms?.length)) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <p className="text-muted-foreground">No visualization data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ViewerControls
          onLayerToggle={handleLayerToggle}
          onLightingChange={handleLightingChange}
          onShadowsToggle={handleShadowsToggle}
          onLightPositionChange={(x, y, z) => {
            scene?.traverse((object) => {
              if (object instanceof THREE.DirectionalLight) {
                object.position.set(x, y, z);
              }
            });
          }}
          onStartMeasure={(type) => setMeasurementMode(type)}
          onCancelMeasure={() => setMeasurementMode('none')}
          onExport={handleExport}
        />
        
        <Card className="col-span-3 h-[500px]">
          <Scene sceneData={sceneData} onSceneReady={handleSceneReady} />
        </Card>
      </div>
      
      {sceneData?.bimModelId && (
        <ClashDetectionReport modelId={sceneData.bimModelId} />
      )}
    </div>
  );
}