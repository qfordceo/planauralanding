import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
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
import { AdminProvider } from "./contexts/AdminContext";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.id);
      }
      if (_event === 'SIGNED_OUT') {
        console.log('User signed out');
        queryClient.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <Router basename="/">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/auth"
                element={!session ? <Auth /> : <Navigate to="/dashboard" replace />}
              />
              <Route
                path="/dashboard"
                element={
                  session ? (
                    <ClientDashboard />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/client-dashboard"
                element={
                  session ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/contractor-dashboard"
                element={
                  session ? (
                    <ContractorDashboard />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  session ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/data-processing-agreement" element={<DataProcessingAgreement />} />
              <Route path="/legal-agreements" element={<LegalAgreements />} />
              <Route
                path="/terms-acknowledgment"
                element={
                  session ? (
                    <TermsAcknowledgment />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/contractor-registration/*"
                element={
                  session ? (
                    <ContractorRegistrationFlow />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/contractor-resources"
                element={
                  session ? (
                    <ContractorResourceHub />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/contractor-compliance"
                element={
                  session ? (
                    <ContractorCompliance />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
            </Route>
          </Routes>
        </Router>
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;