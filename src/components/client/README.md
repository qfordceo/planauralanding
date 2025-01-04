# Client Components Documentation

## ClientDashboard
The main dashboard component for client users.

### Props
None

### Key Features
- Project timeline visualization
- Document repository
- Communication hub
- Build cost tracking
- Materials management
- Saved floor plans and land plots

### Usage
```tsx
<ClientDashboard />
```

### State Management
- Uses React Query for data fetching
- Manages active project state
- Handles document uploads and updates

### Subcomponents
- ProjectTimeline
- DocumentRepository
- CommunicationHub
- BuildCostCard
- MaterialsCard
- SavedFloorPlans
- SavedLandPlots