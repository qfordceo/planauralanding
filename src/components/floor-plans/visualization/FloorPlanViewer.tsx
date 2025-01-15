import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ClashDetectionReport } from "@/components/clash-detection/ClashDetectionReport";

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
    bimModelId?: string; // Added for clash detection
  };
  isLoading?: boolean;
}

export function FloorPlanViewer({ sceneData, isLoading }: FloorPlanViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !sceneData) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create walls
    sceneData.walls.forEach(wall => {
      const wallGeometry = createWallGeometry(wall);
      const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
      const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
      scene.add(wallMesh);
    });

    // Create rooms
    sceneData.rooms.forEach(room => {
      const roomGeometry = createRoomGeometry(room);
      const roomMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xeeeeee,
        side: THREE.DoubleSide 
      });
      const roomMesh = new THREE.Mesh(roomGeometry, roomMaterial);
      scene.add(roomMesh);
    });

    // Position camera
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [sceneData]);

  const createWallGeometry = (wall: { start: { x: number; y: number }; end: { x: number; y: number }; height: number }) => {
    const length = Math.sqrt(
      Math.pow(wall.end.x - wall.start.x, 2) + 
      Math.pow(wall.end.y - wall.start.y, 2)
    );
    
    const geometry = new THREE.BoxGeometry(length, wall.height, 0.2);
    geometry.translate(length / 2, wall.height / 2, 0);
    
    const angle = Math.atan2(
      wall.end.y - wall.start.y,
      wall.end.x - wall.start.x
    );
    
    geometry.rotateY(-angle);
    geometry.translate(wall.start.x, 0, wall.start.y);
    
    return geometry;
  };

  const createRoomGeometry = (room: { points: Array<{ x: number; y: number }>; height: number }) => {
    const shape = new THREE.Shape();
    room.points.forEach((point, index) => {
      if (index === 0) {
        shape.moveTo(point.x, point.y);
      } else {
        shape.lineTo(point.x, point.y);
      }
    });
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: room.height,
      bevelEnabled: false
    });
    
    geometry.rotateX(Math.PI / 2);
    return geometry;
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
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