import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { setupScene, handleResize } from './SceneSetup';
import { createWallGeometry } from '../geometry/WallGeometry';
import { createRoomGeometry } from '../geometry/RoomGeometry';

interface SceneProps {
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
  };
  onSceneReady: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => void;
}

export function Scene({ sceneData, onSceneReady }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !sceneData) return;

    const { scene, camera, renderer } = setupScene(containerRef.current);
    
    // Create layer groups
    const wallsLayer = new THREE.Group();
    const electricalLayer = new THREE.Group();
    const plumbingLayer = new THREE.Group();
    
    scene.add(wallsLayer);
    scene.add(electricalLayer);
    scene.add(plumbingLayer);

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

    // Notify parent component
    onSceneReady(scene, camera, renderer);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [sceneData, onSceneReady]);

  return <div ref={containerRef} className="w-full h-full" />;
}