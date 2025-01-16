import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { AuthForm } from "./AuthForm";

export function AuthContainer() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const defaultTab = searchParams.get('type') || 'client';

  const handleError = (error: Error) => {
    console.error('Auth error:', error);
    setError(error.message);
    toast({
      title: "Authentication Error",
      description: error.message,
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