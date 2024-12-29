import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface WorkerDirectoryProps {
  contractorId: string;
}

export function WorkerDirectory({ contractorId }: WorkerDirectoryProps) {
  const { data: workers } = useQuery({
    queryKey: ['worker-directory', contractorId],
    queryFn: async () => {
      // This would typically fetch from a workers table
      // For now, returning mock data
      return [
        { id: 1, name: "John Doe", role: "Carpenter", status: "available" },
        { id: 2, name: "Jane Smith", role: "Electrician", status: "on-site" },
      ];
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workers?.map((worker) => (
        <Card key={worker.id} className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{worker.name}</h3>
              <p className="text-sm text-muted-foreground">{worker.role}</p>
            </div>
            <Badge className="ml-auto" variant={worker.status === 'available' ? 'success' : 'secondary'}>
              {worker.status}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}