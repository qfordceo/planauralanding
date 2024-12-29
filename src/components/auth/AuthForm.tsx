import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

interface AuthFormProps {
  handleError: (error: Error) => void;
}

export const AuthForm = ({ handleError }: AuthFormProps) => {
  return (
    <SupabaseAuth
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
      providers={["google"]}
      onAuthError={(error: AuthError) => handleError(error)}
    />
  );
};