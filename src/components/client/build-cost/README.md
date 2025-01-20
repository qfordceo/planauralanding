# Cost Estimation System Documentation

## Overview
The cost estimation system provides real-time calculation of building costs based on floor plans, material selections, and local market rates. It integrates with supplier APIs for current pricing and adjusts costs based on location-specific factors.

## Components

### BuildCostCard
Main component that orchestrates the display of all cost-related information.
- Displays total estimated cost
- Shows cost breakdown by category
- Updates in real-time as selections change

### CostOverview
Provides a high-level summary of costs:
- Base building cost
- Customization costs
- Additional fees
- Total projected cost

### MaterialsCostSummary
Detailed breakdown of material costs:
- Individual material prices
- Quantity-based calculations
- Supplier-specific pricing
- Local market adjustments

## Data Flow

1. User selects/modifies building options
2. `useCustomizations` hook triggers cost recalculation
3. `calculate-budget` edge function processes:
   - Material costs from supplier APIs
   - Labor costs with local market adjustments
   - Additional fees and overhead
4. UI updates with new cost information

## Market Rate Adjustments

Local market rates are stored in the `market_rate_adjustments` table with:
- Labor cost multipliers
- Material cost multipliers
- Location-specific adjustments

## Supplier Integration

Material costs are managed through:
- Real-time supplier API integrations
- Automated price updates
- Price history tracking
- Supplier-specific configurations

## Cost Calculation Formula

Total Cost = Base Cost + Customizations + (Labor × Local Rate) + (Materials × Market Rate) + Fees

Where:
- Base Cost = Square Footage × Base Rate
- Customizations = Sum of all selected upgrades
- Labor = Estimated hours × Labor Rate
- Materials = Sum of (Quantity × Current Price) for each material
- Fees = Permits + Insurance + Overhead

## Database Tables

### market_rate_adjustments
Stores location-specific cost multipliers:
- labor_multiplier
- material_multiplier
- overhead_multiplier

### material_price_updates
Tracks material pricing:
- current_price
- supplier_id
- last_update
- next_update

### supplier_api_configs
Manages supplier integrations:
- api_endpoint
- refresh_interval
- authentication

## Edge Functions

### calculate-budget
Main cost calculation endpoint:
- Processes floor plan data
- Applies market adjustments
- Calculates total costs
- Returns detailed breakdown

### fetch-material-prices
Supplier price integration:
- Fetches current prices
- Updates database
- Manages rate limiting
- Handles errors

## UI Color Coding

Cost changes are indicated by colors:
- Green: Cost reduction
- Red: Cost increase
- Yellow: Pending update
- Gray: No change

## Error Handling

The system includes comprehensive error handling for:
- API failures
- Price update issues
- Calculation errors
- Data validation

## Performance Considerations

- Caches material prices
- Batches price updates
- Uses incremental calculations
- Implements rate limiting

## Future Improvements

Planned enhancements:
1. Additional supplier integrations
2. Machine learning for price predictions
3. Enhanced visualization options
4. Bulk pricing optimization