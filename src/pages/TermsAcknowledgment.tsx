import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function TermsAcknowledgment() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleAccept = async () => {
    if (!termsAccepted) {
      setShowError(true);
      return;
    }

    setIsUpdating(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No authenticated user found");

      // Use a more specific query with better error handling
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          terms_accepted: true,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating terms acceptance:', updateError);
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Terms of service accepted",
      });

      // Check user type and redirect accordingly
      const userType = new URLSearchParams(window.location.search).get('type');
      
      // Add a small delay to ensure the profile update is complete
      setTimeout(() => {
        navigate(userType === 'contractor' ? '/contractor-dashboard' : '/client-dashboard');
      }, 500);
    } catch (error) {
      console.error('Error updating terms acceptance:', error);
      toast({
        title: "Error",
        description: "Failed to update terms acceptance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTermsClick = () => {
    window.open("/terms-of-service", "_blank");
  };

  return (
    <div className="container max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Terms of Service Acknowledgment</h1>
      <div className="bg-card rounded-lg p-8 shadow space-y-6">
        <p className="text-muted-foreground">
          Before continuing, please review and accept our terms of service.
        </p>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={termsAccepted}
            onCheckedChange={(checked) => {
              setTermsAccepted(checked as boolean);
              setShowError(false);
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

        {showError && (
          <Alert variant="destructive">
            <AlertDescription>
              You must accept the Terms of Service to continue
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleAccept} 
          className="w-full"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Accept & Continue"}
        </Button>
      </div>
    </div>
  );
}