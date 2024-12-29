import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export const useAuthEvents = (setError: (error: string | null) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      } else if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Password Recovery",
          description: "Check your email for password reset instructions",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, setError]);
};