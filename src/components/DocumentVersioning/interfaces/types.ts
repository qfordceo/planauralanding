import { DocumentVersion } from "@/types/documents";

export interface VersionDiff {
  added: string[];
  removed: string[];
  modified: string[];
}

export interface VersionComparisonResult {
  diff: VersionDiff;
  previousVersion: DocumentVersion | null;
  currentVersion: DocumentVersion;
}

export interface VersionControlsProps {
  onCreateVersion: () => void;
  onRevertVersion: (version: number) => void;
  canCreateVersion: boolean;
  canRevertVersion: boolean;
  isLoading: boolean;
}

export interface VersionBadgeProps {
  version: number;
  isLatest: boolean;
  isCurrent: boolean;
}

export interface DiffViewerProps {
  diff: VersionDiff;
  className?: string;
}

export interface VersionListProps {
  versions: DocumentVersion[];
  currentVersion: number;
  onVersionSelect: (version: number) => void;
  isLoading: boolean;
}

export interface VersionDiffProps {
  previousVersion: DocumentVersion | null;
  currentVersion: DocumentVersion;
}