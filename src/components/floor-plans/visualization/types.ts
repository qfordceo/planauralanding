export interface SceneData {
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
}