import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ClashDetectionReport } from "@/components/clash-detection/ClashDetectionReport";
import * as THREE from 'three';
import { LayerManager } from './controls/LayerManager';
import { LightingControls } from './controls/LightingControls';
import { MeasurementTools } from './controls/MeasurementTools';
import { ExportControls } from './controls/ExportControls';
import { setupScene, handleResize } from './scene/SceneSetup';
import { createWallGeometry } from './geometry/WallGeometry';
import { createRoomGeometry } from './geometry/RoomGeometry';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [measurementMode, setMeasurementMode] = useState<'none' | 'distance' | 'area'>('none');
  const [layers, setLayers] = useState<{ [key: string]: THREE.Group }>({});

  useEffect(() => {
    if (!containerRef.current || !sceneData) return;

    const { scene: newScene, camera: newCamera, renderer: newRenderer } = setupScene(containerRef.current);
    
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);

    // Create layer groups
    const wallsLayer = new THREE.Group();
    const electricalLayer = new THREE.Group();
    const plumbingLayer = new THREE.Group();
    
    newScene.add(wallsLayer);
    newScene.add(electricalLayer);
    newScene.add(plumbingLayer);
    
    setLayers({
      walls: wallsLayer,
      electrical: electricalLayer,
      plumbing: plumbingLayer
    });

    // Create geometry
    if (sceneData.walls?.length > 0) {
      sceneData.walls.forEach(wall => {
        const wallGeometry = createWallGeometry(wall);
        const wallMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xcccccc,
          map: new THREE.TextureLoader().load('/textures/wall.jpg')
        });
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        wallsLayer.add(wallMesh);
      });
    }

    if (sceneData.rooms?.length > 0) {
      sceneData.rooms.forEach(room => {
        const roomGeometry = createRoomGeometry(room);
        const roomMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xeeeeee,
          side: THREE.DoubleSide,
          map: new THREE.TextureLoader().load('/textures/floor.jpg')
        });
        const roomMesh = new THREE.Mesh(roomGeometry, roomMaterial);
        wallsLayer.add(roomMesh);
      });
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const resizeHandler = () => handleResize(containerRef.current!, camera, renderer);
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [sceneData]);

  const handleLayerToggle = (layerName: string, enabled: boolean) => {
    if (layers[layerName]) {
      layers[layerName].visible = enabled;
    }
  };

  const handleLightingChange = (intensity: number) => {
    if (scene) {
      scene.traverse((object) => {
        if (object instanceof THREE.Light) {
          object.intensity = intensity;
        }
      });
    }
  };

  const handleShadowsToggle = (enabled: boolean) => {
    if (renderer) {
      renderer.shadowMap.enabled = enabled;
      scene?.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = enabled;
          object.receiveShadow = enabled;
        }
      });
    }
  };

  const handleExport = async (format: string) => {
    if (!scene || !camera) return;
    
    switch (format) {
      case 'png':
        const dataUrl = renderer?.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'floor-plan.png';
        link.href = dataUrl!;
        link.click();
        break;
      // Add other export formats here
    }
  };

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
        <div className="space-y-4">
          <LayerManager onLayerToggle={handleLayerToggle} />
          <LightingControls
            onIntensityChange={handleLightingChange}
            onShadowsToggle={handleShadowsToggle}
            onPositionChange={(x, y, z) => {
              scene?.traverse((object) => {
                if (object instanceof THREE.DirectionalLight) {
                  object.position.set(x, y, z);
                }
              });
            }}
          />
          <MeasurementTools
            onStartMeasure={(type) => setMeasurementMode(type)}
            onCancelMeasure={() => setMeasurementMode('none')}
          />
          <ExportControls onExport={handleExport} />
        </div>
        
        <Card className="col-span-3 h-[500px]">
          <div ref={containerRef} className="w-full h-full" />
        </Card>
      </div>
      
      {sceneData?.bimModelId && (
        <ClashDetectionReport modelId={sceneData.bimModelId} />
      )}
    </div>
  );
}