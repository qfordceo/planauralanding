import { useEffect } from 'react';
import * as THREE from 'three';

interface ClashMarkersProps {
  scene: THREE.Scene | null;
  clashes: Array<{
    id: string;
    position: { x: number; y: number; z: number };
  }>;
  selectedClashId: string | null;
  onMarkerCreated: (marker: THREE.Mesh) => void;
}

export function ClashMarkers({ 
  scene, 
  clashes, 
  selectedClashId,
  onMarkerCreated 
}: ClashMarkersProps) {
  useEffect(() => {
    if (!scene) return;

    // Clear existing markers
    scene.children
      .filter(child => child instanceof THREE.Mesh && child.userData.isClashMarker)
      .forEach(marker => scene.remove(marker));

    // Create new markers
    clashes.forEach(clash => {
      const geometry = new THREE.SphereGeometry(0.2);
      const material = new THREE.MeshBasicMaterial({ 
        color: clash.id === selectedClashId ? 0xff0000 : 0xff6b6b,
        transparent: true,
        opacity: 0.8
      });
      
      const marker = new THREE.Mesh(geometry, material);
      marker.position.set(clash.position.x, clash.position.y, clash.position.z);
      marker.userData = { id: clash.id, isClashMarker: true };
      
      scene.add(marker);
      onMarkerCreated(marker);
    });
  }, [scene, clashes, selectedClashId, onMarkerCreated]);

  return null;
}