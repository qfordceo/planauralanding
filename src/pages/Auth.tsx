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
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)

  // Check initial session only once
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session && !isProcessing) {
          setIsProcessing(true)
          await handleRedirect(session)
        }
      } catch (error) {
        console.error('Session check error:', error)
        setError('Failed to check session status')
      } finally {
        setIsLoading(false)
        setSessionChecked(true)
      }
    }

    if (!sessionChecked) {
      checkSession()
    }
  }, [handleRedirect, isProcessing, sessionChecked])

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session && !isProcessing) {
        setIsProcessing(true)
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
  }, [handleRedirect, isProcessing])

  if (isLoading) {
    return (
      <div className="container max-w-lg mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-lg mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome Back</h1>
      {error && (
        <Alert variant="destructive" className="mb-4 animate-none">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="bg-card rounded-lg p-8 shadow">
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { background: 'var(--primary)', color: 'white' },
              anchor: { color: 'var(--primary)' },
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