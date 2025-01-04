export interface ContractorMetrics {
  totalProjects: number;
  completedProjects: number;
  onTimeRate: number;
}

export type BadgeType = 
  | "expeditious"
  | "clientFavorite" 
  | "precision"
  | "responsive"
  | "adaptable"
  | "topContractor"
  | "highVolume"
  | "preferred"
  | "compliant"
  | "paperwork"
  | "safety";