import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Construction } from "lucide-react";

interface TimelineStep {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  description: string;
}

const buildingSteps: TimelineStep[] = [
  {
    id: '1',
    title: 'Pre-Construction Planning',
    status: 'completed',
    description: 'Floor plan selection, land acquisition, and initial cost estimates'
  },
  {
    id: '2',
    title: 'Permits and Approvals',
    status: 'in_progress',
    description: 'Obtaining necessary building permits and zoning approvals'
  },
  {
    id: '3',
    title: 'Site Preparation',
    status: 'pending',
    description: 'Land clearing, grading, and foundation preparation'
  },
  {
    id: '4',
    title: 'Foundation',
    status: 'pending',
    description: 'Pouring foundation and waterproofing'
  },
  {
    id: '5',
    title: 'Framing',
    status: 'pending',
    description: 'Construction of walls, roof, and basic structure'
  },
  {
    id: '6',
    title: 'Utilities Installation',
    status: 'pending',
    description: 'Electrical, plumbing, and HVAC systems'
  },
  {
    id: '7',
    title: 'Interior and Exterior Finishing',
    status: 'pending',
    description: 'Drywall, painting, flooring, and exterior siding'
  },
  {
    id: '8',
    title: 'Final Inspection',
    status: 'pending',
    description: 'Final walkthrough and obtaining certificate of occupancy'
  }
];

export function ProjectTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Construction className="h-5 w-5" />
          Building Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {buildingSteps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                {step.status === 'completed' && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
                {step.status === 'in_progress' && (
                  <Clock className="h-6 w-6 text-blue-500 animate-pulse" />
                )}
                {step.status === 'pending' && (
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                )}
                {index < buildingSteps.length - 1 && (
                  <div className="h-full w-0.5 bg-gray-200 my-2" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}