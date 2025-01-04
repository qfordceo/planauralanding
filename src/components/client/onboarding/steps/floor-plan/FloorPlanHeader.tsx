interface FloorPlanHeaderProps {
  title?: string;
  description?: string;
}

export function FloorPlanHeader({ 
  title = "Choose Your Floor Plan",
  description = "Select a floor plan that matches your vision"
}: FloorPlanHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
}