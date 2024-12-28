import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Session } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

export const useAuthRedirect = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleRedirect = async (session: Session | null) => {
    if (!session) {
      console.log('No session, redirecting to auth')
      navigate('/auth')
      return
    }

    try {
      // First check if the user exists in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, is_admin')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        // If the profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: session.user.id,
                email: session.user.email,
                is_admin: false // Default to non-admin
              }
            ])

          if (insertError) {
            console.error('Error creating profile:', insertError)
            toast({
              title: "Error",
              description: "Failed to create user profile",
              variant: "destructive",
            })
            return
          }

          // New user created, redirect to dashboard
          navigate('/dashboard')
          return
        }

        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
        return
      }

      if (!profile) {
        console.log('No profile found, redirecting to dashboard')
        navigate('/dashboard')
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
    }
  }

  return handleRedirect
}