import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function Auth() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get("mode") || "signin"
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile to check admin status
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single()

          toast({
            title: "Welcome!",
            description: profile?.is_admin ? "Signed in as admin." : "Successfully signed in.",
          })
          navigate("/")
        } else if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
          navigate('/auth')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, toast])

  return (
    <div className="container max-w-lg py-20 animate-fade-up">
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </CardTitle>
          <p className="text-muted-foreground">
            {mode === "signin"
              ? "Welcome back! Please sign in to continue."
              : "Create an account to get started."}
          </p>
        </CardHeader>
        <CardContent>
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            onError={(error) => {
              toast({
                title: "Authentication Error",
                description: error.message,
                variant: "destructive",
              })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}