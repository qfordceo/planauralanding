import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/usePermissions";
import { GuideEditor } from "./GuideEditor";
import { useState } from "react";

export function UserGuides() {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const [editingGuide, setEditingGuide] = useState<string | null>(null);

  const { data: guides, isLoading } = useQuery({
    queryKey: ['documentation-guides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documentation_guides')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getGuideContent = (type: string) => {
    const guide = guides?.find(g => g.guide_type === type);
    return guide?.content || {};
  };

  if (isLoading) {
    return <div>Loading guides...</div>;
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <div className="flex justify-between items-center mb-6">
        <h1>User Guides</h1>
        {isAdmin && editingGuide === null && (
          <Button onClick={() => setEditingGuide('new')}>
            Create New Guide
          </Button>
        )}
      </div>
      
      {editingGuide ? (
        <GuideEditor 
          guideId={editingGuide === 'new' ? null : editingGuide}
          onClose={() => setEditingGuide(null)}
        />
      ) : (
        <Tabs defaultValue="client" className="w-full">
          <TabsList>
            <TabsTrigger value="client">Client Guide</TabsTrigger>
            <TabsTrigger value="contractor">Contractor Guide</TabsTrigger>
            <TabsTrigger value="admin">Admin Guide</TabsTrigger>
            <TabsTrigger value="general">General Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="client">
            <GuideDisplay 
              guide={getGuideContent('client')} 
              onEdit={() => setEditingGuide('client')}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="contractor">
            <GuideDisplay 
              guide={getGuideContent('contractor')} 
              onEdit={() => setEditingGuide('contractor')}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="admin">
            <GuideDisplay 
              guide={getGuideContent('admin')} 
              onEdit={() => setEditingGuide('admin')}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="general">
            <GuideDisplay 
              guide={getGuideContent('general')} 
              onEdit={() => setEditingGuide('general')}
              isAdmin={isAdmin}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function GuideDisplay({ guide, onEdit, isAdmin }: { 
  guide: any, 
  onEdit: () => void,
  isAdmin: boolean 
}) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{guide.title}</h2>
          {guide.version && (
            <p className="text-sm text-gray-500">
              Version {guide.version} • Last updated: {new Date(guide.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
        {isAdmin && (
          <Button variant="outline" onClick={onEdit}>
            Edit Guide
          </Button>
        )}
      </div>

      <div className="mt-4">
        {guide.sections?.map((section: any, index: number) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
            <ul className="list-disc pl-6 space-y-2">
              {section.items?.map((item: string, itemIndex: number) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}