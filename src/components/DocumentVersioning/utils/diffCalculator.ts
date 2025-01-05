import { DocumentVersion } from "@/types/documents";
import { VersionDiff } from "../interfaces/types";

export function calculateDiff(
  previousVersion: DocumentVersion,
  currentVersion: DocumentVersion
): VersionDiff {
  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];

  // Compare metadata
  const prevMeta = previousVersion.metadata;
  const currMeta = currentVersion.metadata;

  if (prevMeta.size !== currMeta.size) {
    modified.push(`File size changed from ${prevMeta.size} to ${currMeta.size} bytes`);
  }

  if (prevMeta.original_name !== currMeta.original_name) {
    modified.push(`Filename changed from ${prevMeta.original_name} to ${currMeta.original_name}`);
  }

  return {
    added,
    removed,
    modified,
  };
}