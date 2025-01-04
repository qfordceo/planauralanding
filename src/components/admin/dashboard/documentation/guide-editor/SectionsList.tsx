import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GuideSection } from "./types";

interface SectionsListProps {
  sections: GuideSection[];
  onChange: (sections: GuideSection[]) => void;
}

export function SectionsList({ sections, onChange }: SectionsListProps) {
  const addSection = () => {
    onChange([...sections, { title: "", items: [""] }]);
  };

  const updateSectionTitle = (index: number, title: string) => {
    const newSections = [...sections];
    newSections[index].title = title;
    onChange(newSections);
  };

  const addItem = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].items.push("");
    onChange(newSections);
  };

  const updateItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex] = value;
    onChange(newSections);
  };

  return (
    <div>
      <Label>Sections</Label>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mt-4 p-4 border rounded-md">
          <Input
            value={section.title}
            onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
            placeholder="Section Title"
            className="mb-2"
          />

          {section.items.map((item, itemIndex) => (
            <Input
              key={itemIndex}
              value={item}
              onChange={(e) => updateItem(sectionIndex, itemIndex, e.target.value)}
              placeholder="List item"
              className="mt-2"
            />
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => addItem(sectionIndex)}
            className="mt-2"
          >
            Add Item
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addSection}
        className="mt-4"
      >
        Add Section
      </Button>
    </div>
  );
}