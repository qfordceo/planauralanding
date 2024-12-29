import { useEffect, useState } from "react"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNavigate } from "react-router-dom"

export default function Auth() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (session?.user) {
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('Session check error:', error)
        setError('Failed to check session status')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

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
              button: { 
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '0.375rem',
                fontWeight: '500',
              },
              anchor: { color: 'var(--primary)' },
              input: {
                borderRadius: '0.375rem',
              },
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