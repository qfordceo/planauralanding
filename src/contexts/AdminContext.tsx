import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminContextType {
  impersonatedUserId: string | null;
  startImpersonation: (userId: string) => Promise<void>;
  stopImpersonation: () => void;
  isImpersonating: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const startImpersonation = async (userId: string) => {
    try {
      const { data: userToImpersonate, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setImpersonatedUserId(userId);
      toast({
        title: "Impersonation Started",
        description: `Now viewing as ${userToImpersonate.email}`,
      });
    } catch (error) {
      console.error('Impersonation error:', error);
      toast({
        title: "Impersonation Failed",
        description: "Unable to impersonate user",
        variant: "destructive",
      });
    }
  };

  const stopImpersonation = () => {
    setImpersonatedUserId(null);
    toast({
      title: "Impersonation Ended",
      description: "Returned to admin view",
    });
  };

  return (
    <AdminContext.Provider
      value={{
        impersonatedUserId,
        startImpersonation,
        stopImpersonation,
        isImpersonating: !!impersonatedUserId,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}