# Document Versioning Hooks

## useDocumentVersioning
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

## useVersionDiff
```typescript
function useVersionDiff(
  previousVersion: DocumentVersion | null,
  currentVersion: DocumentVersion
): VersionDiff | null
```

Calculates differences between two versions of a document.