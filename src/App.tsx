import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import ClientDashboard from "./pages/ClientDashboard";
import FloorPlanUpload from "./pages/FloorPlanUpload";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "client-dashboard",
        element: <ClientDashboard />,
      },
      {
        path: "floor-plans/upload",
        element: <FloorPlanUpload />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
