# Document Versioning Testing Guide

## Running Tests
```bash
# Unit and integration tests
npm test

# E2E tests
npm run test:e2e
```

## Test Coverage

### Unit Tests
- Version comparison logic
- Metadata comparison
- Edge cases handling
- Diff calculation verification

### Integration Tests
- Version list rendering
- Version switching functionality
- Loading states
- Component interaction

### E2E Tests
- Complete version creation flow
- Version switching
- Revert functionality
- Large document handling

### Performance Tests
- Large document uploads (10MB+)
- Response time measurements
- UI responsiveness
- Memory usage optimization