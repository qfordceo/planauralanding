import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboardContainer } from "@/components/admin/dashboard/AdminDashboardContainer";
import { useAuthCheck } from "@/hooks/useAuthCheck";

export default function AdminDashboard() {
  const navigate = useNavigate();
  useAuthCheck(navigate, "/auth");

  return <AdminDashboardContainer />;
}