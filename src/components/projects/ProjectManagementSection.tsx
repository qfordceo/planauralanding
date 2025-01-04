import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ProjectList } from "./ProjectList";
import { useState } from "react";
import { NewProjectDialog } from "./NewProjectDialog";

interface ProjectManagementSectionProps {
  userId: string;
  projects: any[];
}

export function ProjectManagementSection({ userId, projects }: ProjectManagementSectionProps) {
  const [showNewProject, setShowNewProject] = useState(false);
  
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Projects</h2>
        <Button onClick={() => setShowNewProject(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {!projects?.length ? (
        <Card className="p-6 text-center text-muted-foreground">
          <p>You haven't created any projects yet.</p>
          <p className="text-sm mt-2">Click the New Project button to get started.</p>
        </Card>
      ) : (
        <ProjectList projects={projects} />
      )}

      <NewProjectDialog 
        open={showNewProject} 
        onOpenChange={setShowNewProject}
        userId={userId}
      />
    </div>
  );
}