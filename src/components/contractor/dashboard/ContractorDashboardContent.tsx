import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardContent } from "./DashboardContent"
import { LoadingState } from "./LoadingState"
import { NoProfileState } from "./NoProfileState"
import { ContractorRegistration } from "./ContractorRegistration"
import { TermsModal } from "./TermsModal"
import { useContractorDashboard } from "./useContractorDashboard"
import type { Contractor } from "@/types/contractor"

const queryClient = new QueryClient()

interface ContractorDashboardContentProps {
  contractor: Contractor
}

export function ContractorDashboardContent({ contractor }: ContractorDashboardContentProps) {
  const {
    isLoading,
    error,
    contractor: contractorData,
    showTermsModal,
    setShowTermsModal,
  } = useContractorDashboard()

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <NoProfileState />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent
        contractor={contractorData || contractor}
        activeSection={null}
        setActiveSection={() => {}}
        outbidCount={0}
        defectCount={0}
      />
      <TermsModal
        showTermsModal={showTermsModal}
        setShowTermsModal={setShowTermsModal}
      />
    </QueryClientProvider>
  )
}