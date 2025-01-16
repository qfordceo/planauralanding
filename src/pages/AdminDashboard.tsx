import { AdminDashboardContainer } from "@/components/admin/dashboard/AdminDashboardContainer";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Administration</h1>
      <AdminDashboardContainer />
    </div>
  );
}