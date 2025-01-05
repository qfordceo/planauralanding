import { useMemo } from 'react';
import { DocumentVersion } from '@/types/documents';
import { VersionDiff } from '../interfaces/types';
import { calculateDiff } from '../utils/diffCalculator';

export function useVersionDiff(
  previousVersion: DocumentVersion | null,
  currentVersion: DocumentVersion
): VersionDiff | null {
  return useMemo(() => {
    if (!previousVersion) return null;
    return calculateDiff(previousVersion, currentVersion);
  }, [previousVersion, currentVersion]);
}