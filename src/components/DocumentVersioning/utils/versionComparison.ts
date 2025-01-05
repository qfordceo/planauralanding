import { DocumentVersion } from "@/types/documents";
import { VersionComparisonResult } from "../interfaces/types";

export function compareVersions(
  versions: DocumentVersion[],
  currentVersion: number
): VersionComparisonResult {
  const sortedVersions = [...versions].sort((a, b) => b.version_number - a.version_number);
  const currentVersionData = sortedVersions.find(v => v.version_number === currentVersion);
  const previousVersionData = sortedVersions.find(v => v.version_number === currentVersion - 1);

  if (!currentVersionData) {
    throw new Error('Current version not found');
  }

  return {
    previousVersion: previousVersionData || null,
    currentVersion: currentVersionData,
    diff: {
      added: [],
      removed: [],
      modified: [],
    },
  };
}