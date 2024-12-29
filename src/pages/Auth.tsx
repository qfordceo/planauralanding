import { useEffect, useState } from "react"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "react-router-dom"
import { AuthError, AuthResponse, Session } from "@supabase/supabase-js"

export default function Auth() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const defaultTab = searchParams.get('type') || 'client'

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
      } else if (event === 'SIGNED_UP') {
        toast({
          title: "Almost there!",
          description: "Please check your email to confirm your account. If you don't see it, check your spam folder.",
          duration: 6000,
        })
      }
    })

    // Handle auth state changes and errors
    const {
      data: { subscription: errorSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_DELETED') {
        setError('Account has been deleted')
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery",
          description: "Check your email for password reset instructions",
        })
      }
    })

    return () => {
      subscription.unsubscribe()
      errorSubscription.unsubscribe()
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

  const handleError = (error: Error) => {
    console.error('Auth error:', error)
    if (error.message.includes('rate limit')) {
      setError('Too many attempts. Please try again later.')
    } else if (error.message.includes('confirmation email')) {
      toast({
        title: "Email Confirmation Required",
        description: "Please check your email and spam folder for the confirmation link.",
        duration: 6000,
      })
    } else {
      setError(error.message)
    }
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
              onError={handleError}
            />
          </TabsContent>
          <TabsContent value="contractor">
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
              onError={handleError}
            />
          </TabsContent>
        </Tabs>
      </div>
      <p className="text-sm text-center mt-4 text-muted-foreground">
        This site is protected by enhanced security measures.
      </p>
    </div>
  )
}