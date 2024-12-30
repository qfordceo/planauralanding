import { Contractor } from "@/types/contractor";
import { DashboardSection } from "./DashboardSection";
import { sections } from "./sections";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardGridProps {
  contractor: Contractor;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  outbidCount: number;
  defectCount: number;
}

export function DashboardGrid({
  contractor,
  activeSection,
  setActiveSection,
  outbidCount,
  defectCount,
}: DashboardGridProps) {
  const isMobile = useIsMobile();

  // Group sections by category
  const sectionGroups = {
    projects: sections.filter(section => 
      ['JobsSection', 'RebidSection', 'DefectsSection', 'PortfolioSection'].includes(section.name)
    ),
    management: sections.filter(section => 
      ['ClientManagementSection', 'WorkforceSection', 'MaterialManagementSection', 'ExpenseSection'].includes(section.name)
    ),
    business: sections.filter(section => 
      ['MarketingSection', 'AnalyticsSection', 'PaymentsSection', 'ComplianceSection'].includes(section.name)
    )
  };

  const groupTitles = {
    projects: "Projects & Work",
    management: "Management",
    business: "Business Operations"
  };

  return (
    <Tabs defaultValue="projects" className="w-full mt-6">
      <TabsList className="w-full justify-start mb-6 bg-background border-b rounded-none h-auto p-0">
        {Object.entries(groupTitles).map(([key, title]) => (
          <TabsTrigger 
            key={key}
            value={key} 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            {title}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(sectionGroups).map(([group, groupSections]) => (
        <TabsContent key={group} value={group} className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className={`grid gap-4 ${
              isMobile 
                ? 'grid-cols-1' 
                : activeSection 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {groupSections.map((Section) => (
                <DashboardSection
                  key={Section.name}
                  Section={Section}
                  contractor={contractor}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  outbidCount={outbidCount}
                  defectCount={defectCount}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}