import { useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAuthCheck(navigate: NavigateFunction, redirectPath: string) {
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) {
          navigate(redirectPath);
          return;
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
        navigate(redirectPath);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate(redirectPath);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, redirectPath, toast]);
}