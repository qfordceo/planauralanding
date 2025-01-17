import * as THREE from 'three';

interface RoomData {
  points: Array<{ x: number; y: number }>;
  height: number;
}

export function createRoomGeometry(room: RoomData): THREE.BufferGeometry {
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
}