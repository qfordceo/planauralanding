import { ProjectOversight } from "./ProjectOversight";
import { WaitlistTable } from "../WaitlistTable";

export function AdminDashboardContainer() {
  return (
    <div className="space-y-6">
      <WaitlistTable />
      <ProjectOversight />
    </div>
  );
}