import { useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ClashDetectionReport } from "@/components/clash-detection/ClashDetectionReport";
import * as THREE from 'three';
import { SceneControls } from './components/SceneControls';
import { SceneContainer } from './components/SceneContainer';
import { ClashMarkers } from './components/ClashMarkers';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SceneData } from './types';

interface FloorPlanViewerProps {
  sceneData?: SceneData;
  isLoading?: boolean;
}

export function FloorPlanViewer({ sceneData, isLoading }: FloorPlanViewerProps) {
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [measurementMode, setMeasurementMode] = useState<'none' | 'distance' | 'area'>('none');
  const [layers, setLayers] = useState<{ [key: string]: THREE.Group }>({});
  const [clashMarkers, setClashMarkers] = useState<THREE.Mesh[]>([]);
  const [selectedClash, setSelectedClash] = useState<string | null>(null);
  const [clashes, setClashes] = useState<Array<{ id: string; position: { x: number; y: number; z: number } }>>([]);
  const { toast } = useToast();

  const handleSceneReady = useCallback((
    newScene: THREE.Scene,
    newCamera: THREE.PerspectiveCamera,
    newRenderer: THREE.WebGLRenderer
  ) => {
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
  }, []);

  const handleMarkerCreated = useCallback((marker: THREE.Mesh) => {
    setClashMarkers(prev => [...prev, marker]);
  }, []);

  const handleClashSelect = useCallback((clashId: string, position: { x: number; y: number; z: number }) => {
    if (camera) {
      const target = new THREE.Vector3(position.x, position.y, position.z);
      camera.position.set(target.x + 5, target.y + 5, target.z + 5);
      camera.lookAt(target);
      setSelectedClash(clashId);
    }
  }, [camera]);

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
    if (renderer && scene) {
      renderer.shadowMap.enabled = enabled;
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = enabled;
          object.receiveShadow = enabled;
        }
      });
    }
  }, [renderer, scene]);

  const handleExport = useCallback(async (format: string) => {
    if (!scene || !camera || !renderer) return;
    
    if (format === 'png') {
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
        <SceneControls
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
        
        <SceneContainer 
          sceneData={sceneData}
          onSceneReady={handleSceneReady}
        />
      </div>
      
      {scene && (
        <ClashMarkers
          scene={scene}
          clashes={clashes}
          selectedClashId={selectedClash}
          onMarkerCreated={handleMarkerCreated}
        />
      )}
      
      {sceneData?.bimModelId && (
        <ClashDetectionReport 
          modelId={sceneData.bimModelId}
          onClashSelect={handleClashSelect}
          selectedClashId={selectedClash}
        />
      )}
    </div>
  );
}