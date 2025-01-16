import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export function AuthContainer() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const defaultTab = searchParams.get('type') || 'client';

  // Get the current window location origin
  const redirectTo = `${window.location.origin}/auth`;

  const handleError = (message: string) => {
    console.error('Auth error:', message);
    setError(message);
    toast({
      title: "Authentication Error",
      description: message,
      variant: "destructive",
    });
  };

  return (
    <div className="container max-w-lg mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome Back</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="bg-card rounded-lg p-8 shadow">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="contractor">Contractor</TabsTrigger>
          </TabsList>
          <TabsContent value="client">
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
                }
              }}
              providers={[]}
              redirectTo={redirectTo}
            />
          </TabsContent>
          <TabsContent value="contractor">
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
                  }
                }
              }}
              providers={[]}
              redirectTo={redirectTo}
            />
          </TabsContent>
        </Tabs>
      </div>
      <p className="text-sm text-center mt-4 text-muted-foreground">
        This site is protected by enhanced security measures.
      </p>
    </div>
  );
}