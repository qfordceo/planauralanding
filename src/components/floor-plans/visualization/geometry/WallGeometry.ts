import * as THREE from 'three';

interface WallData {
  start: { x: number; y: number };
  end: { x: number; y: number };
  height: number;
}

export function createWallGeometry(wall: WallData): THREE.BufferGeometry {
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
}