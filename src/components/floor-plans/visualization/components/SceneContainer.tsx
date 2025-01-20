import { Card } from "@/components/ui/card";
import { Scene } from '../scene/Scene';
import { SceneData } from '../types';
import * as THREE from 'three';

interface SceneContainerProps {
  sceneData: SceneData;
  onSceneReady: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => void;
}

export function SceneContainer({ sceneData, onSceneReady }: SceneContainerProps) {
  return (
    <Card className="col-span-3 h-[500px]">
      <Scene 
        sceneData={sceneData}
        onSceneReady={onSceneReady}
      />
    </Card>
  );
}