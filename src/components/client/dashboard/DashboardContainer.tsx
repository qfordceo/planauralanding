import { useClientProfile } from "./hooks/useClientProfile";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardGrid } from "./DashboardGrid";

export function DashboardContainer() {
  const { data: profile, isLoading, error } = useClientProfile();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <DashboardHeader isLoading={isLoading} error={error} />
      {profile && (
        <DashboardGrid
          profile={profile}
          activeBuild={null}
          activeSection={null}
          setActiveSection={() => {}}
        />
      )}
    </div>
  );
}