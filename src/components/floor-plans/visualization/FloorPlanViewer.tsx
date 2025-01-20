import { useState, useCallback, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ClashDetectionReport } from "@/components/clash-detection/ClashDetectionReport";
import * as THREE from 'three';
import { Scene } from './scene/Scene';
import { ViewerControls } from './controls/ViewerControls';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [clashMarkers, setClashMarkers] = useState<THREE.Mesh[]>([]);
  const [selectedClash, setSelectedClash] = useState<string | null>(null);
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

  const createClashMarker = useCallback((position: { x: number, y: number, z: number }, id: string) => {
    const geometry = new THREE.SphereGeometry(0.2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff6b6b, 
      transparent: true, 
      opacity: 0.8 
    });
    const marker = new THREE.Mesh(geometry, material);
    marker.position.set(position.x, position.y, position.z);
    marker.userData.id = id;
    return marker;
  }, []);

  const handleClashSelect = useCallback((clashId: string, position: { x: number, y: number, z: number }) => {
    if (camera && scene) {
      // Highlight the selected clash marker
      clashMarkers.forEach(marker => {
        const material = marker.material as THREE.MeshBasicMaterial;
        material.color.setHex(marker.userData.id === clashId ? 0xff0000 : 0xff6b6b);
      });

      // Move camera to clash location
      const target = new THREE.Vector3(position.x, position.y, position.z);
      camera.position.set(target.x + 5, target.y + 5, target.z + 5);
      camera.lookAt(target);
      
      setSelectedClash(clashId);
    }
  }, [camera, scene, clashMarkers]);

  useEffect(() => {
    if (scene && sceneData?.bimModelId) {
      // Clear existing clash markers
      clashMarkers.forEach(marker => scene.remove(marker));
      setClashMarkers([]);

      // Fetch and display clash detection results
      const fetchClashes = async () => {
        const { data: report, error } = await supabase
          .from('clash_detection_reports')
          .select('*')
          .eq('id', sceneData.bimModelId)
          .single();

        if (error) {
          toast({
            title: "Error loading clash data",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (report && report.model_data) {
          const newMarkers = report.model_data.elements
            .filter((element: any) => element.clash)
            .map((element: any) => createClashMarker(
              element.position,
              element.id
            ));

          newMarkers.forEach(marker => scene.add(marker));
          setClashMarkers(newMarkers);
        }
      };

      fetchClashes();
    }
  }, [scene, sceneData?.bimModelId, createClashMarker, toast]);

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
          <Scene 
            sceneData={sceneData} 
            onSceneReady={handleSceneReady}
          />
        </Card>
      </div>
      
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