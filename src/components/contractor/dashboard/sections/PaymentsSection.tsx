import { DollarSign } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { PaymentMilestones } from "@/components/contractor/payments/PaymentMilestones";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentsSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function PaymentsSection({
  contractorId,
  activeSection,
  setActiveSection,
}: PaymentsSectionProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const { data: projects } = useQuery({
    queryKey: ["contractor-projects", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_projects")
        .select("*")
        .eq("contractor_id", contractorId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardCard
      title="Payments & Milestones"
      description="Track payments, manage milestones, and monitor project financials."
      icon={DollarSign}
      buttonText={activeSection === "payments" ? "Close Payments" : "Manage Payments"}
      onClick={() => setActiveSection(activeSection === "payments" ? null : "payments")}
      expanded={activeSection === "payments"}
      visibility="private"
    >
      {activeSection === "payments" && (
        <div className="space-y-4">
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedProjectId && (
            <PaymentMilestones
              contractorId={contractorId}
              projectId={selectedProjectId}
            />
          )}
        </div>
      )}
    </DashboardCard>
  );
}