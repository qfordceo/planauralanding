interface MaterialsHeaderProps {
  title?: string;
  description?: string;
}

export function MaterialsHeader({ 
  title = "Select Your Materials",
  description = "Choose the materials for your build"
}: MaterialsHeaderProps) {
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