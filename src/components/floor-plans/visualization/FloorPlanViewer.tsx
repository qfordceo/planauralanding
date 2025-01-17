import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ClashDetectionReport } from "@/components/clash-detection/ClashDetectionReport";
import { setupScene, handleResize } from './scene/SceneSetup';
import { createWallGeometry } from './geometry/WallGeometry';
import { createRoomGeometry } from './geometry/RoomGeometry';
import * as THREE from 'three';

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

  useEffect(() => {
    if (!containerRef.current || !sceneData) return;

    const { scene, camera, renderer } = setupScene(containerRef.current);

    // Create walls if they exist
    if (sceneData.walls?.length > 0) {
      sceneData.walls.forEach(wall => {
        const wallGeometry = createWallGeometry(wall);
        const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        scene.add(wallMesh);
      });
    }

    // Create rooms if they exist
    if (sceneData.rooms?.length > 0) {
      sceneData.rooms.forEach(room => {
        const roomGeometry = createRoomGeometry(room);
        const roomMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xeeeeee,
          side: THREE.DoubleSide 
        });
        const roomMesh = new THREE.Mesh(roomGeometry, roomMaterial);
        scene.add(roomMesh);
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
      <Card className="w-full h-[500px]">
        <div ref={containerRef} className="w-full h-full" />
      </Card>
      
      {sceneData?.bimModelId && (
        <ClashDetectionReport modelId={sceneData.bimModelId} />
      )}
    </div>
  );
}