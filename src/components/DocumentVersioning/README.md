# Document Versioning System Documentation

## Overview
The document versioning system provides a complete solution for managing document versions, including creation, comparison, and restoration of versions.

## Components

### VersionControls
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

### VersionList
```typescript
interface VersionListProps {
  versions: DocumentVersion[];
  currentVersion: number;
  onVersionSelect: (version: number) => void;
  isLoading: boolean;
}
```

Displays a scrollable list of all versions with their timestamps and status indicators.

### VersionDiff
```typescript
interface VersionDiffProps {
  previousVersion: DocumentVersion | null;
  currentVersion: DocumentVersion;
}
```

Shows differences between two versions including metadata changes.

## Hooks

### useDocumentVersioning
```typescript
function useDocumentVersioning(documentId: string) {
  return {
    versions: DocumentVersion[];
    isLoading: boolean;
    createVersion: (file: File) => Promise<void>;
    revertVersion: (version: number) => Promise<void>;
    isCreating: boolean;
    isReverting: boolean;
  }
}
```

Main hook for managing document versions. Handles version creation, retrieval, and restoration.

### useVersionDiff
```typescript
function useVersionDiff(
  previousVersion: DocumentVersion | null,
  currentVersion: DocumentVersion
): VersionDiff | null
```

Calculates differences between two versions of a document.

## Usage Examples

### Creating a New Version
```typescript
const { createVersion, isCreating } = useDocumentVersioning(documentId);

// Handle file upload
const handleFileUpload = async (file: File) => {
  await createVersion(file);
};
```

### Reverting to a Previous Version
```typescript
const { revertVersion, isReverting } = useDocumentVersioning(documentId);

// Revert to specific version
const handleRevert = async (versionNumber: number) => {
  await revertVersion(versionNumber);
};
```

### Comparing Versions
```typescript
const { versions } = useDocumentVersioning(documentId);

// Compare current with previous version
<VersionDiff 
  previousVersion={versions[1]}
  currentVersion={versions[0]}
/>
```

## Version Comparison

The system tracks the following changes between versions:
- File size changes
- Filename changes
- Metadata modifications
- Creation timestamps
- Author information

Changes are displayed with color coding:
- 🟢 Green: Additions
- 🔴 Red: Removals
- 🔵 Blue: Modifications

## Storage and Security

Documents are stored in the `project-documents` storage bucket with the following structure:
`{documentId}/{versionNumber}.{extension}`

Version metadata is stored in the `document_versions` table with references to the storage path.

## Error Handling

The system includes built-in error handling for:
- Upload failures
- Version creation errors
- Revert operation failures
- Invalid file types

Error messages are displayed using the toast notification system.

## Performance Considerations

- Versions are loaded lazily to improve initial load time
- Diff calculation is memoized to prevent unnecessary recalculations
- Large file uploads are handled with progress tracking
- Version list uses virtualization for efficient rendering

## Testing

The system includes comprehensive tests:
- Unit tests for version comparison logic
- Integration tests for version switching
- E2E tests for the complete version creation flow
- Performance tests for large document handling

Run tests using:
```bash
# Unit and integration tests
npm test

# E2E tests
npm run test:e2e
```