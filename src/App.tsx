
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import { ClientDashboard } from "./components/client/ClientDashboard";
import LandingPage from "./pages/LandingPage";
import FloorPlanUpload from "./pages/FloorPlanUpload";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Auth from "./pages/Auth";
import ContractorInspectionVideos from "./pages/ContractorInspectionVideos";
import Pricing from "./pages/Pricing";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
        errorElement: <ErrorBoundary><LandingPage /></ErrorBoundary>,
      },
      {
        path: "/pricing",
        element: <Pricing />,
        errorElement: <ErrorBoundary><Pricing /></ErrorBoundary>,
      },
      {
        path: "client-dashboard",
        element: <ClientDashboard />,
        errorElement: <ErrorBoundary><ClientDashboard /></ErrorBoundary>,
      },
      {
        path: "floor-plans/upload",
        element: <FloorPlanUpload />,
        errorElement: <ErrorBoundary><FloorPlanUpload /></ErrorBoundary>,
      },
      {
        path: "floor-plan-upload",
        element: <FloorPlanUpload />,
        errorElement: <ErrorBoundary><FloorPlanUpload /></ErrorBoundary>,
      },
      {
        path: "auth",
        element: <Auth />,
        errorElement: <ErrorBoundary><Auth /></ErrorBoundary>,
      },
      {
        path: "contractor/inspection-videos",
        element: <ContractorInspectionVideos />,
        errorElement: <ErrorBoundary><ContractorInspectionVideos /></ErrorBoundary>,
      }
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
