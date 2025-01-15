import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CustomizationList } from './CustomizationList';

interface CustomizationTabsProps {
  options: any[];
  selectedCustomizations: Array<{
    customization_id: string;
    quantity: number;
  }>;
  onCustomizationChange: (customizationId: string, quantity: number) => void;
}

export function CustomizationTabs({
  options,
  selectedCustomizations,
  onCustomizationChange
}: CustomizationTabsProps) {
  return (
    <Tabs defaultValue="floorplan">
      <TabsList>
        <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="finishes">Finishes</TabsTrigger>
      </TabsList>

      {['floorplan', 'materials', 'finishes'].map(type => (
        <TabsContent key={type} value={type}>
          <CustomizationList
            options={options}
            selectedCustomizations={selectedCustomizations}
            onCustomizationChange={onCustomizationChange}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}