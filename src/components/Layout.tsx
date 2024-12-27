import { Routes, Route } from "react-router-dom"
import Auth from "@/pages/Auth"
import Index from "@/pages/Index"
import Waitlist from "@/pages/Waitlist"
import FloorPlans from "@/pages/FloorPlans"
import ContractorDashboard from "@/pages/ContractorDashboard"

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/floor-plans" element={<FloorPlans />} />
          <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
        </Routes>
      </main>
      {children}
      <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
    </div>
  )
}