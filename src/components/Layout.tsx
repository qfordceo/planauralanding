import { Routes, Route } from "react-router-dom"
import Auth from "@/pages/Auth"
import Index from "@/pages/Index"
import Waitlist from "@/pages/Waitlist"
import FloorPlans from "@/pages/FloorPlans"
import ContractorDashboard from "@/pages/ContractorDashboard"
import LandingPage from "@/pages/LandingPage"
import AdminDashboard from "@/pages/AdminDashboard"
import ClientDashboard from "@/pages/ClientDashboard"
import PrivacyPolicy from "@/pages/PrivacyPolicy"
import DataProcessingAgreement from "@/pages/DataProcessingAgreement"
import { Footer } from "./layout/Footer"

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/listings" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/floor-plans" element={<FloorPlans />} />
          <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/data-processing-agreement" element={<DataProcessingAgreement />} />
        </Routes>
      </main>
      <Footer />
      {children}
    </div>
  );
}