import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectOverviewProps {
  title: string;
  description: string;
}

export function ProjectOverview({ title, description }: ProjectOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}