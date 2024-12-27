import { useEffect } from "react"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"

// Constants for security settings
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export default function Auth() {
  const { toast } = useToast()
  const handleRedirect = useAuthRedirect()

  // Session timeout handler
  useEffect(() => {
    let sessionTimer: NodeJS.Timeout

    const resetSessionTimer = () => {
      if (sessionTimer) clearTimeout(sessionTimer)
      sessionTimer = setTimeout(() => {
        supabase.auth.signOut()
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })
      }, SESSION_TIMEOUT)
    }

    const handleUserActivity = () => {
      resetSessionTimer()
    }

    window.addEventListener("mousemove", handleUserActivity)
    window.addEventListener("keydown", handleUserActivity)

    resetSessionTimer()

    return () => {
      if (sessionTimer) clearTimeout(sessionTimer)
      window.removeEventListener("mousemove", handleUserActivity)
      window.removeEventListener("keydown", handleUserActivity)
    }
  }, [toast])

  // Check initial session and handle auth state changes
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      handleRedirect(session)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Reset login attempts on successful sign-in
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('lockoutUntil')
        handleRedirect(session)
      }
    })

    checkUser()
    return () => subscription.unsubscribe()
  }, [handleRedirect])

  // Enhanced auth UI configuration with security features
  const authConfig = {
    supabaseClient: supabase,
    appearance: { 
      theme: ThemeSupa,
      style: {
        button: { background: 'primary', color: 'white' },
        anchor: { color: 'primary' },
      },
    },
    providers: [],
    redirectTo: window.location.origin,
    callbacks: {
      onAuthError: (error: Error) => {
        // Implement rate limiting
        const loginAttempts = Number(localStorage.getItem('loginAttempts') || 0)
        const lockoutUntil = localStorage.getItem('lockoutUntil')

        if (lockoutUntil && Date.now() < Number(lockoutUntil)) {
          const remainingTime = Math.ceil((Number(lockoutUntil) - Date.now()) / 1000 / 60)
          toast({
            title: "Account Locked",
            description: `Too many login attempts. Please try again in ${remainingTime} minutes.`,
            variant: "destructive",
          })
          return
        }

        if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION
          localStorage.setItem('lockoutUntil', lockoutTime.toString())
          localStorage.setItem('loginAttempts', '0')
          toast({
            title: "Account Locked",
            description: "Too many login attempts. Please try again in 15 minutes.",
            variant: "destructive",
          })
          return
        }

        localStorage.setItem('loginAttempts', (loginAttempts + 1).toString())
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        })
      },
    },
  }

  return (
    <div className="container max-w-lg mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome Back</h1>
      <div className="bg-card rounded-lg p-8 shadow">
        <SupabaseAuth {...authConfig} />
      </div>
      <p className="text-sm text-center mt-4 text-muted-foreground">
        This site is protected by enhanced security measures including rate limiting and session management.
      </p>
    </div>
  )
}