import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EducationalResource } from "@/types/contractor";

export function ResourceLibrary() {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["educational-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as EducationalResource[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Resource Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {resources?.map((resource) => (
            <Card key={resource.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <Badge variant="outline">{resource.resource_type}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
                {resource.external_links?.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between"
                    >
                      {link.title}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}