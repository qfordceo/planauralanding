import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminHeader } from "./AdminHeader";
import { AdminTabs } from "./AdminTabs";
import { LoadingState } from "./LoadingState";
import { useAdminAuth } from "./AdminAuth";

export function AdminDashboardContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useAdminAuth({ setLoading: setIsLoading, setError });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <AdminHeader error={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <AdminHeader error={error} />
      <AdminTabs />
    </div>
  );
}