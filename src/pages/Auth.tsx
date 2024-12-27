import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCircle2, HardHat } from "lucide-react"

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
        console.log("Auth state changed:", event, session);
        
        if (event === "SIGNED_IN" && session) {
          if (isContractor) {
            // Check if contractor profile exists
            const { data: contractor, error: contractorError } = await supabase
              .from("contractors")
              .select("id")
              .eq("user_id", session.user.id)
              .single()

            console.log("Contractor check:", { contractor, contractorError });

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
              console.log("No contractor profile found for user:", session.user.id);
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
          console.log("User signed out");
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
                className="flex items-center gap-2"
              >
                <UserCircle2 className="h-4 w-4" />
                Client
              </TabsTrigger>
              <TabsTrigger 
                value="contractor" 
                onClick={() => setIsContractor(true)}
                className="flex items-center gap-2"
              >
                <HardHat className="h-4 w-4" />
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
                    brand: 'rgb(45, 24, 16)',
                    brandAccent: 'rgb(45, 24, 16)',
                  },
                },
              },
              className: {
                button: 'bg-primary hover:bg-primary/90',
              },
            }}
            providers={[]}
            redirectTo={window.location.origin + "/auth/callback"}
            onlyThirdPartyProviders={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}