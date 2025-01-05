# Document Versioning Examples

## Creating a New Version
```typescript
const { createVersion, isCreating } = useDocumentVersioning(documentId);

// Handle file upload
const handleFileUpload = async (file: File) => {
  await createVersion(file);
};
```

## Reverting to a Previous Version
```typescript
const { revertVersion, isReverting } = useDocumentVersioning(documentId);

// Revert to specific version
const handleRevert = async (versionNumber: number) => {
  await revertVersion(versionNumber);
};
```

## Comparing Versions
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