interface ProjectDisputesTabProps {
  projectId: string;
}

export function ProjectDisputesTab({ projectId }: ProjectDisputesTabProps) {
  return (
    <div>
      <div className="text-muted-foreground text-center py-8">
        No disputes found for this project
      </div>
    </div>
  );
}