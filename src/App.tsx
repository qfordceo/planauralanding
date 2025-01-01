import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import ContractorDashboard from "./pages/ContractorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Waitlist from "./pages/Waitlist";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DataProcessingAgreement from "./pages/DataProcessingAgreement";
import TermsOfService from "./pages/TermsOfService";
import LegalAgreements from "./pages/LegalAgreements";
import TermsAcknowledgment from "./pages/TermsAcknowledgment";
import ContractorRegistrationFlow from "./pages/ContractorRegistrationFlow";
import ContractorResourceHub from "./pages/ContractorResourceHub";
import ContractorCompliance from "./pages/ContractorCompliance";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="auth" element={<Auth />} />
            <Route path="client-dashboard" element={<ClientDashboard />} />
            <Route path="contractor-dashboard" element={<ContractorDashboard />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="waitlist" element={<Waitlist />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="data-processing-agreement" element={<DataProcessingAgreement />} />
            <Route path="legal-agreements" element={<LegalAgreements />} />
            <Route path="terms-acknowledgment" element={<TermsAcknowledgment />} />
            <Route path="contractor-registration/*" element={<ContractorRegistrationFlow />} />
            <Route path="contractor-resources" element={<ContractorResourceHub />} />
            <Route path="contractor-compliance" element={<ContractorCompliance />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;