export const VERSION_STATUS = {
  LATEST: 'latest',
  CURRENT: 'current',
  HISTORICAL: 'historical',
} as const;

export const DIFF_TYPES = {
  ADDED: 'added',
  REMOVED: 'removed',
  MODIFIED: 'modified',
} as const;

export const MAX_VERSIONS = 50;
export const MIN_VERSION = 1;