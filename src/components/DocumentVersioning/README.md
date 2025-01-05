# Document Versioning System Documentation

Welcome to the document versioning system documentation. This system provides comprehensive version control for documents in your application.

## Documentation Sections

1. [Overview](./docs/Overview.md)
   - System introduction
   - Key features
   - Architecture
   - Security and storage

2. [Components](./docs/Components.md)
   - VersionControls
   - VersionList
   - VersionDiff

3. [Hooks](./docs/Hooks.md)
   - useDocumentVersioning
   - useVersionDiff

4. [Examples](./docs/Examples.md)
   - Creating versions
   - Reverting versions
   - Comparing versions
   - Version tracking

5. [Testing](./docs/Testing.md)
   - Test coverage
   - Running tests
   - Performance testing

## Quick Start

```typescript
import { useDocumentVersioning } from './hooks/useDocumentVersioning';

function DocumentManager({ documentId }: { documentId: string }) {
  const { versions, createVersion } = useDocumentVersioning(documentId);
  
  return (
    <div>
      <VersionList versions={versions} />
      <VersionControls onCreateVersion={createVersion} />
    </div>
  );
}
```

For detailed information, please refer to the specific documentation sections above.