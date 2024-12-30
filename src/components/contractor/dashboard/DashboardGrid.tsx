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
    projects: ['jobs', 'bids', 'defects', 'portfolio'],
    management: ['clients', 'workforce', 'materials', 'expenses'],
    business: ['marketing', 'analytics', 'payments', 'compliance']
  };

  return (
    <Tabs defaultValue="projects" className="w-full mt-6">
      <TabsList className="w-full justify-start mb-6 bg-background border-b rounded-none h-auto p-0">
        <TabsTrigger value="projects" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
          Projects & Work
        </TabsTrigger>
        <TabsTrigger value="management" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
          Management
        </TabsTrigger>
        <TabsTrigger value="business" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
          Business
        </TabsTrigger>
      </TabsList>

      {Object.entries(sectionGroups).map(([group, sectionNames]) => (
        <TabsContent key={group} value={group} className="mt-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className={`grid gap-4 ${
              isMobile 
                ? 'grid-cols-1' 
                : activeSection 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {sections
                .filter(Section => sectionNames.includes(Section.name.toLowerCase()))
                .map((Section) => (
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