import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="auth" element={<Auth />} />
          <Route path="client-dashboard" element={<ClientDashboard />} />
          <Route path="contractor-dashboard" element={<ContractorDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="waitlist" element={<Waitlist />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="data-processing-agreement" element={<DataProcessingAgreement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;