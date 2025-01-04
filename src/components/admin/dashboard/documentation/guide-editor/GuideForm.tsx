import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GuideTypeSelect } from "./GuideTypeSelect";
import { SectionsList } from "./SectionsList";
import type { Guide, GuideSection } from "./types";

interface GuideFormProps {
  initialData: Guide | null;
  onSubmit: (data: Guide) => void;
  onCancel: () => void;
}

export function GuideForm({ initialData, onSubmit, onCancel }: GuideFormProps) {
  const [title, setTitle] = useState("");
  const [guideType, setGuideType] = useState("client");
  const [sections, setSections] = useState<GuideSection[]>([]);
  const [changeSummary, setChangeSummary] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setGuideType(initialData.guide_type);
      setSections(initialData.content.sections || []);
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({
      ...(initialData?.id ? { id: initialData.id } : {}),
      title,
      guide_type: guideType,
      content: { sections },
      change_summary: changeSummary,
      is_published: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Guide Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>

      <GuideTypeSelect value={guideType} onChange={setGuideType} />

      <SectionsList sections={sections} onChange={setSections} />

      <div>
        <Label htmlFor="changeSummary">Change Summary</Label>
        <Textarea
          id="changeSummary"
          value={changeSummary}
          onChange={(e) => setChangeSummary(e.target.value)}
          placeholder="Describe what changed in this update"
          className="mt-1"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Guide' : 'Create Guide'}
        </Button>
      </div>
    </div>
  );
}