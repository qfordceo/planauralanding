import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Session } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

export const useAuthRedirect = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleRedirect = async (session: Session | null) => {
    if (!session) {
      navigate('/auth')
      return
    }

    try {
      // Check if user is an admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin, email')
        .eq('id', session.user.id)
        .maybeSingle()

      if (error) {
        console.error('Error checking admin status:', error)
        throw error
      }

      if (!profile) {
        console.error('No profile found for user')
        toast({
          title: "Error",
          description: "Unable to load user profile",
          variant: "destructive",
        })
        return
      }

      console.log('Profile loaded:', profile)

      if (profile.is_admin) {
        console.log('User is admin, redirecting to admin dashboard')
        navigate('/admin')
        return
      }

      // If not admin, redirect to client dashboard
      console.log('User is not admin, redirecting to client dashboard')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error in auth redirect:', error)
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
      navigate('/auth')
    }
  }

  return handleRedirect
}