import { BadgeIcons } from "./BadgeIcons";

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

export interface BadgeConfig {
  icon: React.ReactNode;
  label: string;
  description: string;
  criteria: string;
}

export const badgeConfigs: Record<BadgeType, BadgeConfig> = {
  expeditious: {
    icon: BadgeIcons.expeditious,
    label: "Expeditious & Efficient",
    description: "Consistently completes projects ahead of schedule",
    criteria: "95%+ on-time completion rate"
  },
  clientFavorite: {
    icon: BadgeIcons.clientFavorite,
    label: "Client Favorite",
    description: "Consistently high client ratings",
    criteria: "4.8/5+ average rating (10+ projects)"
  },
  precision: {
    icon: BadgeIcons.precision,
    label: "Precision & Quality",
    description: "Exceptional craftsmanship",
    criteria: "Less than 2% callbacks"
  },
  responsive: {
    icon: BadgeIcons.responsive,
    label: "Responsive Communicator",
    description: "Excellent communication",
    criteria: "90%+ response rate within 24h"
  },
  adaptable: {
    icon: BadgeIcons.adaptable,
    label: "Adaptable Problem Solver",
    description: "Navigates challenges effectively",
    criteria: "Minimal escalations"
  },
  topContractor: {
    icon: BadgeIcons.topContractor,
    label: "Top Contractor",
    description: "Excellence across metrics",
    criteria: "3+ core badges"
  },
  highVolume: {
    icon: BadgeIcons.highVolume,
    label: "High Volume Performer",
    description: "Handles many projects successfully",
    criteria: "20+ projects/year"
  },
  preferred: {
    icon: BadgeIcons.preferred,
    label: "Preferred Partner",
    description: "Long-standing excellence",
    criteria: "1+ year with high performance"
  },
  compliant: {
    icon: BadgeIcons.compliant,
    label: "Fully Compliant",
    description: "Perfect compliance record",
    criteria: "No compliance issues for 1 year"
  },
  paperwork: {
    icon: BadgeIcons.paperwork,
    label: "Paperwork Pro",
    description: "Timely documentation",
    criteria: "No documentation delays"
  },
  safety: {
    icon: BadgeIcons.safety,
    label: "Safety First",
    description: "Excellent safety record",
    criteria: "Zero safety violations"
  }
};