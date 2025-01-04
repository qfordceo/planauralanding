# Contract Components Documentation

## ContractWorkflowManager
Manages the contract creation and signing workflow.

### Props
```typescript
interface ContractWorkflowManagerProps {
  projectId: string;
}
```

### Key Features
- Contract creation
- Review process
- Digital signing
- Version tracking
- Workflow stages

### Usage
```tsx
<ContractWorkflowManager projectId="project-id" />
```

### State Management
- Uses WorkflowContext for stage management
- Handles contract versions
- Manages signing status
- Tracks review process

### Subcomponents
- ContractSetup
- ContractReview
- ContractSignature
- WorkflowContent