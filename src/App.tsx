import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import { ClientDashboard } from "./components/client/ClientDashboard";
import FloorPlanUpload from "./pages/FloorPlanUpload";
import { ErrorBoundary } from "./components/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary><Layout /></ErrorBoundary>,
    children: [
      {
        path: "/",
        element: <ClientDashboard />,
        errorElement: <ErrorBoundary><ClientDashboard /></ErrorBoundary>,
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
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}