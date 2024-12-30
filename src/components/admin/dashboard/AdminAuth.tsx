import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface AdminAuthProps {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useAdminAuth({ setLoading, setError }: AdminAuthProps) {
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }
        
        if (!session) {
          navigate('/auth')
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          throw profileError
        }

        if (!profile?.is_admin) {
          navigate('/')
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          })
          return
        }

        setLoading(false)
      } catch (error) {
        console.error('Error checking admin access:', error)
        setError('Failed to verify admin access. Please try logging in again.')
        setLoading(false)
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth')
      }
    })

    checkAdminAccess()

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, toast, setLoading, setError])
}