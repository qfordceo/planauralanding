# Document Versioning Components

## VersionControls
```typescript
interface VersionControlsProps {
  onCreateVersion: () => void;
  onRevertVersion: (version: number) => void;
  canCreateVersion: boolean;
  canRevertVersion: boolean;
  isLoading: boolean;
}
```

Controls for creating new versions and reverting to previous versions.

## VersionList
```typescript
interface VersionListProps {
  versions: DocumentVersion[];
  currentVersion: number;
  onVersionSelect: (version: number) => void;
  isLoading: boolean;
}
```

Displays a scrollable list of all versions with their timestamps and status indicators.

## VersionDiff
```typescript
interface VersionDiffProps {
  previousVersion: DocumentVersion | null;
  currentVersion: DocumentVersion;
}
```

Shows differences between two versions including metadata changes.