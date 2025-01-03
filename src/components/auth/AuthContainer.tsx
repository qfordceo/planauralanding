import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { AuthForm } from "./AuthForm";
import { useAuthEvents } from "@/hooks/useAuthEvents";
import { LoadingSpinner } from "./LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";

export function AuthContainer() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const defaultTab = searchParams.get('type') || 'client';

  useAuthEvents(setError);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session check error:', sessionError);
          setError("Unable to check login status. Please try again.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        setError("An unexpected error occurred. Please try again.");
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleError = (error: Error) => {
    console.error('Auth error:', error);
    if (error.message.includes('rate limit')) {
      setError('Too many attempts. Please try again later.');
    } else if (error.message.includes('Invalid login credentials')) {
      setError('Invalid email or password. Please try again.');
    } else if (error.message.includes('confirmation email')) {
      toast({
        title: "Email Confirmation Required",
        description: "Please check your email and spam folder for the confirmation link.",
        duration: 6000,
      });
    } else {
      setError('An error occurred during login. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
            <AuthForm handleError={handleError} />
          </TabsContent>
          <TabsContent value="contractor">
            <AuthForm handleError={handleError} />
          </TabsContent>
        </Tabs>
      </div>
      <p className="text-sm text-center mt-4 text-muted-foreground">
        This site is protected by enhanced security measures.
      </p>
    </div>
  );
}