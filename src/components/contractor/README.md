# Contractor Components Documentation

## ContractorDashboard
Main dashboard interface for contractor users.

### Props
```typescript
interface ContractorDashboardProps {
  contractor: Contractor;
}
```

### Key Features
- Job management
- Availability scheduling
- Expense tracking
- Portfolio management
- Marketing tools
- Analytics dashboard

### Usage
```tsx
<ContractorDashboard contractor={contractorData} />
```

### State Management
- Uses React Query for data fetching
- Manages contractor profile state
- Handles availability updates
- Tracks expenses and portfolio items

### Subcomponents
- DashboardHeader
- DashboardGrid
- TaskManagement
- MilestoneTracker
- ExpenseTracker
- PortfolioManager