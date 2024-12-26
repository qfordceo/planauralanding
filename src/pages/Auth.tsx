import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Auth() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get("mode") || "signin"
  const type = searchParams.get("type") || "client"
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isContractor, setIsContractor] = useState(type === "contractor")

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          if (isContractor) {
            // Check if contractor profile exists
            const { data: contractor } = await supabase
              .from("contractors")
              .select("id")
              .eq("user_id", session.user.id)
              .single()

            if (contractor) {
              toast({
                title: "Welcome back!",
                description: "Successfully signed in as contractor.",
              })
              navigate("/contractor-dashboard")
            } else if (mode === "signup") {
              // New contractor registration
              toast({
                title: "Welcome!",
                description: "Please complete your contractor profile.",
              })
              navigate("/contractor-dashboard")
            } else {
              toast({
                title: "Error",
                description: "No contractor profile found. Please sign up as a contractor.",
                variant: "destructive",
              })
              await supabase.auth.signOut()
            }
          } else {
            toast({
              title: "Welcome!",
              description: "Successfully signed in.",
            })
            navigate("/")
          }
        } else if (event === "SIGNED_OUT") {
          navigate("/auth")
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, toast, isContractor, mode])

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
          <Tabs defaultValue={type} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="client" 
                onClick={() => setIsContractor(false)}
              >
                Client
              </TabsTrigger>
              <TabsTrigger 
                value="contractor" 
                onClick={() => setIsContractor(true)}
              >
                Contractor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="client">
              <p className="text-sm text-muted-foreground mb-6">
                Sign in as a client to browse floor plans and schedule appointments.
              </p>
            </TabsContent>
            <TabsContent value="contractor">
              <p className="text-sm text-muted-foreground mb-6">
                Sign in as a contractor to manage your profile, portfolio, and appointments.
              </p>
            </TabsContent>
          </Tabs>
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
            redirectTo="https://fe79dc55-f4c1-41b2-a931-3b7bb0609fd3.lovableproject.com/auth/callback"
            onlyThirdPartyProviders={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}