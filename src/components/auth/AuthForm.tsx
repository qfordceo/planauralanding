import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  handleError: (error: Error) => void;
}

export const AuthForm = ({ handleError }: AuthFormProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const userType = searchParams.get('type') || 'client';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('terms_accepted')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            toast({
              title: "Error",
              description: "Unable to load your profile. Please try again.",
              variant: "destructive",
            });
            return;
          }

          if (!profile?.terms_accepted) {
            navigate('/terms-acknowledgment');
          } else if (userType === 'contractor') {
            navigate('/contractor-dashboard');
          } else {
            navigate('/client-dashboard');
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          toast({
            title: "Error",
            description: "An error occurred during login. Please try again.",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, userType, toast]);

  return (
    <div className="space-y-6">
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          style: {
            button: { 
              backgroundColor: '#2D1810',
              color: '#FFFFFF',
              borderRadius: '0.375rem',
              fontWeight: '500',
              padding: '0.5rem 1rem',
              height: '2.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
            },
            anchor: { color: '#2D1810' },
            input: {
              borderRadius: '0.375rem',
            },
            message: {
              color: 'var(--foreground)',
            },
            label: {
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
              display: 'block',
            }
          },
          variables: {
            default: {
              colors: {
                brand: '#2D1810',
                brandAccent: '#8B7355',
              }
            }
          }
        }}
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_input_placeholder: "Your email address",
              password_input_placeholder: "Your password",
              email_label: "Email",
              password_label: "Password",
            }
          }
        }}
        redirectTo={window.location.origin + '/auth?type=' + userType}
      />
    </div>
  );
};