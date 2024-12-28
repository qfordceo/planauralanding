import { useState } from "react";
import type { Contractor } from "@/types/contractor";

export function useDashboardState() {
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [outbidCount, setOutbidCount] = useState(0);
  const [defectCount, setDefectCount] = useState(0);

  return {
    loading,
    setLoading,
    registering,
    setRegistering,
    contractor,
    setContractor,
    activeSection,
    setActiveSection,
    outbidCount,
    setOutbidCount,
    defectCount,
    setDefectCount,
  };
}