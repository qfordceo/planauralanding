import { OnboardingProgress } from "./onboarding/OnboardingProgress";
import { ResourceLibrary } from "./education/ResourceLibrary";
import { GanttChart } from "./analytics/GanttChart";
import { TimelineView } from "./analytics/TimelineView";
import { DefectTracker } from "./DefectTracker";
import { BidNotifications } from "./BidNotifications";
import { TrainingManager } from "./TrainingManager";
import { PortfolioManager } from "./PortfolioManager";
import { Contractor } from "@/types/contractor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContractorDashboardProps {
  contractor: Contractor;
}

export function ContractorDashboard({ contractor }: ContractorDashboardProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <OnboardingProgress contractorId={contractor.id} />
      
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects & Tasks</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <BidNotifications contractorId={contractor.id} />
            <DefectTracker contractorId={contractor.id} />
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <TimelineView contractorId={contractor.id} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <GanttChart contractorId={contractor.id} />
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <TrainingManager contractorId={contractor.id} />
        <PortfolioManager contractorId={contractor.id} />
      </div>
      
      <ResourceLibrary />
    </div>
  );
}