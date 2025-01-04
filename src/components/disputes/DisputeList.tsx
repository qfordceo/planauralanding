import { Card } from "@/components/ui/card";

interface Dispute {
  id: string;
  description: string;
  status: string;
  created_at: string;
}

interface DisputeListProps {
  disputes: Dispute[];
}

export function DisputeList({ disputes }: DisputeListProps) {
  return (
    <div className="space-y-4">
      {disputes.map((dispute) => (
        <Card key={dispute.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">
                {new Date(dispute.created_at).toLocaleDateString()}
              </p>
              <p className="mt-2">{dispute.description}</p>
            </div>
            <span className="text-sm font-medium capitalize px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              {dispute.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}