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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard')
      }
      // Handle rate limit errors
      if (event === 'SIGNED_UP' && !session) {
        toast({
          title: "Too many attempts",
          description: "Please wait a few minutes before trying again",
          variant: "destructive",
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, toast])

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
                backgroundColor: '#2D1810',
                color: '#FFFFFF',
                borderRadius: '0.375rem',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                height: '2.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
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
            },
            variables: {
              default: {
                colors: {
                  brand: '#2D1810',
                  brandAccent: '#8B7355',
                }
              }
            }
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