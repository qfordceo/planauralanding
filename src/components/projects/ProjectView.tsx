import { useEffect } from "react";
import { ContractWorkflowManager } from "../contracts/ContractWorkflowManager";
import { ProjectLaunchFlow } from "./launch/ProjectLaunchFlow";
import { ProjectDetails } from "./ProjectDetails";

interface ProjectViewProps {
  project: {
    id: string;
    contractor_bids: Array<{
      id: string;
      contractor_id: string;
      bid_amount: number;
      status: string;
    }>;
    project_contracts: Array<{
      id: string;
      status: string;
      signed_by_client_at: string | null;
      signed_by_contractor_at: string | null;
    }>;
  };
}

export function ProjectView({ project }: ProjectViewProps) {
  const contract = project.project_contracts?.[0];
  const acceptedBid = project.contractor_bids?.[0];

  // Show contract workflow if contract exists but isn't fully signed
  if (contract && (!contract.signed_by_client_at || !contract.signed_by_contractor_at)) {
    return <ContractWorkflowManager projectId={project.id} />;
  }

  // Show project launch flow if bid is accepted but no contract exists
  if (acceptedBid && !contract) {
    return (
      <ProjectLaunchFlow
        projectId={project.id}
        acceptedBid={acceptedBid}
      />
    );
  }

  // Show project details for active projects
  return <ProjectDetails projectId={project.id} />;
}