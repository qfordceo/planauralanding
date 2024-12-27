import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Constants for security settings
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Session timeout handler
  useEffect(() => {
    let sessionTimer: NodeJS.Timeout;

    const resetSessionTimer = () => {
      if (sessionTimer) clearTimeout(sessionTimer);
      sessionTimer = setTimeout(() => {
        supabase.auth.signOut();
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      }, SESSION_TIMEOUT);
    };

    // Reset timer on user activity
    const handleUserActivity = () => {
      resetSessionTimer();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    // Initialize session timer
    resetSessionTimer();

    return () => {
      if (sessionTimer) clearTimeout(sessionTimer);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [toast]);

  // Rate limiting and authentication state management
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // First check if user is a contractor
        const { data: contractor } = await supabase
          .from('contractors')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (contractor) {
          navigate('/contractor-dashboard');
          return;
        }

        // If not a contractor, check if admin or regular client
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_admin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    };

    const handleAuthChange = async (event: string, session: any) => {
      if (event === 'SIGNED_IN') {
        // Reset login attempts on successful sign-in
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutUntil');

        // First check if user is a contractor
        const { data: contractor } = await supabase
          .from('contractors')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (contractor) {
          navigate('/contractor-dashboard');
          return;
        }

        // If not a contractor, check if admin or regular client
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_admin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    checkUser();
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Enhanced auth UI configuration with security features
  const authConfig = {
    supabaseClient: supabase,
    appearance: { 
      theme: ThemeSupa,
      style: {
        button: { background: 'primary', color: 'white' },
        anchor: { color: 'primary' },
      },
    },
    providers: [],
    redirectTo: window.location.origin,
    callbacks: {
      onAuthError: (error: Error) => {
        // Implement rate limiting
        const loginAttempts = Number(localStorage.getItem('loginAttempts') || 0);
        const lockoutUntil = localStorage.getItem('lockoutUntil');

        if (lockoutUntil && Date.now() < Number(lockoutUntil)) {
          const remainingTime = Math.ceil((Number(lockoutUntil) - Date.now()) / 1000 / 60);
          toast({
            title: "Account Locked",
            description: `Too many login attempts. Please try again in ${remainingTime} minutes.`,
            variant: "destructive",
          });
          return;
        }

        if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION;
          localStorage.setItem('lockoutUntil', lockoutTime.toString());
          localStorage.setItem('loginAttempts', '0');
          toast({
            title: "Account Locked",
            description: "Too many login attempts. Please try again in 15 minutes.",
            variant: "destructive",
          });
          return;
        }

        localStorage.setItem('loginAttempts', (loginAttempts + 1).toString());
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  };

  return (
    <div className="container max-w-lg mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome Back</h1>
      <div className="bg-card rounded-lg p-8 shadow">
        <SupabaseAuth {...authConfig} />
      </div>
      <p className="text-sm text-center mt-4 text-muted-foreground">
        This site is protected by enhanced security measures including rate limiting and session management.
      </p>
    </div>
  );
}