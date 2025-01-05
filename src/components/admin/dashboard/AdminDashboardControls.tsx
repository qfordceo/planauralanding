import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AdminDashboardControlsProps {
  isImpersonating: boolean;
  stopImpersonation: () => void;
}

export function AdminDashboardControls({ 
  isImpersonating, 
  stopImpersonation 
}: AdminDashboardControlsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewAs = (type: 'client' | 'contractor') => {
    navigate(type === 'client' ? '/client-dashboard' : '/contractor-dashboard');
    toast({
      title: `Viewing as ${type}`,
      description: `Now viewing the ${type} dashboard as an admin`,
    });
  };

  const handleImpersonateView = (type: 'client' | 'contractor') => {
    navigate(type === 'client' ? '/client-dashboard' : '/contractor-dashboard');
    toast({
      title: `Impersonating ${type}`,
      description: `Now viewing the ${type} dashboard as if you were a ${type}`,
    });
  };

  if (isImpersonating) {
    return (
      <Button 
        variant="destructive"
        onClick={() => stopImpersonation()}
      >
        Stop Impersonation
      </Button>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="border rounded-lg p-4 space-y-2">
        <h3 className="font-semibold mb-2">Direct View</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => handleViewAs('client')}
          >
            Client Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleViewAs('contractor')}
          >
            Contractor Dashboard
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 space-y-2">
        <h3 className="font-semibold mb-2">Impersonation Mode</h3>
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            onClick={() => handleImpersonateView('client')}
          >
            Impersonate Client
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleImpersonateView('contractor')}
          >
            Impersonate Contractor
          </Button>
        </div>
      </div>
    </div>
  );
}