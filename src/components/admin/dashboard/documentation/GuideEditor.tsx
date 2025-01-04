import { useState, useEffect } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GuideEditorProps {
  guideId: string | null;
  onClose: () => void;
}

export function GuideEditor({ guideId, onClose }: GuideEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [guideType, setGuideType] = useState("client");
  const [sections, setSections] = useState<Array<{ title: string; items: string[] }>>([]);
  const [changeSummary, setChangeSummary] = useState("");

  const { data: guide, isLoading } = useQuery({
    queryKey: ['guide', guideId],
    queryFn: async () => {
      if (!guideId) return null;
      const { data, error } = await supabase
        .from('documentation_guides')
        .select('*')
        .eq('id', guideId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!guideId
  });

  useEffect(() => {
    if (guide) {
      setTitle(guide.title);
      setGuideType(guide.guide_type);
      setSections(guide.content.sections || []);
    }
  }, [guide]);

  const saveGuide = useMutation({
    mutationFn: async () => {
      const guideData = {
        title,
        guide_type: guideType,
        content: { sections },
        change_summary: changeSummary,
        is_published: true,
      };

      if (guideId) {
        const { error } = await supabase
          .from('documentation_guides')
          .update(guideData)
          .eq('id', guideId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('documentation_guides')
          .insert([guideData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation-guides'] });
      toast({
        title: "Success",
        description: `Guide ${guideId ? 'updated' : 'created'} successfully`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save guide: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const addSection = () => {
    setSections([...sections, { title: "", items: [""] }]);
  };

  const updateSectionTitle = (index: number, title: string) => {
    const newSections = [...sections];
    newSections[index].title = title;
    setSections(newSections);
  };

  const addItem = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].items.push("");
    setSections(newSections);
  };

  const updateItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex] = value;
    setSections(newSections);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {guideId ? 'Edit Guide' : 'Create New Guide'}
      </h2>

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

        <div>
          <Label htmlFor="type">Guide Type</Label>
          <select
            id="type"
            value={guideType}
            onChange={(e) => setGuideType(e.target.value)}
            className="w-full mt-1 border rounded-md p-2"
          >
            <option value="client">Client Guide</option>
            <option value="contractor">Contractor Guide</option>
            <option value="admin">Admin Guide</option>
            <option value="general">General Usage</option>
          </select>
        </div>

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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => saveGuide.mutate()}>
            {guideId ? 'Update Guide' : 'Create Guide'}
          </Button>
        </div>
      </div>
    </Card>
  );
}