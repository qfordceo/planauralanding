import { useEffect, useState } from "react"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Auth() {
  const { toast } = useToast()
  const handleRedirect = useAuthRedirect()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check initial session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await handleRedirect(session)
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [handleRedirect])

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          await handleRedirect(session)
        } catch (error) {
          console.error('Auth state change error:', error)
          setError('An error occurred during login. Please try again.')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [handleRedirect])

  if (isLoading) {
    return (
      <div className="container max-w-lg mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
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
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { background: 'primary', color: 'white' },
              anchor: { color: 'primary' },
            },
          }}
          providers={[]}
        />
      </div>
      <p className="text-sm text-center mt-4 text-muted-foreground">
        This site is protected by enhanced security measures.
      </p>
    </div>
  )
}