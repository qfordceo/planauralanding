import { ContractorDashboardContent } from "./dashboard/ContractorDashboardContent"
import type { Contractor } from "@/types/contractor"

interface ContractorDashboardProps {
  contractor: Contractor
}

export function ContractorDashboard({ contractor }: ContractorDashboardProps) {
  return <ContractorDashboardContent contractor={contractor} />
}