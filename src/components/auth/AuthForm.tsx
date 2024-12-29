import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  handleError: (error: Error) => void;
}

export const AuthForm = ({ handleError }: AuthFormProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const navigate = useNavigate();

  const handleTermsClick = () => {
    navigate("/terms-of-service");
  };

  const handleSubmit = async (formData: { email: string; password: string }) => {
    if (!termsAccepted) {
      setShowTermsError(true);
      return false;
    }
    return true;
  };

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
        providers={["google"]}
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
        onSubmit={handleSubmit}
      />
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={termsAccepted}
          onCheckedChange={(checked) => {
            setTermsAccepted(checked as boolean);
            setShowTermsError(false);
          }}
        />
        <Label htmlFor="terms" className="text-sm">
          I have read and agree to the{" "}
          <button
            type="button"
            className="text-primary underline hover:text-primary/80"
            onClick={handleTermsClick}
          >
            Terms of Service
          </button>
        </Label>
      </div>

      {showTermsError && (
        <Alert variant="destructive">
          <AlertDescription>
            You must accept the Terms of Service to continue
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};