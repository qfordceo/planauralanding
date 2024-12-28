import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Session } from "@supabase/supabase-js"

export const useAuthRedirect = () => {
  const navigate = useNavigate()

  const handleRedirect = async (session: Session | null) => {
    if (!session) {
      navigate('/auth')
      return
    }

    try {
      // First check if user is an admin
      const { data: adminProfile, error: adminError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .maybeSingle()

      if (adminError) {
        console.error('Error checking admin status:', adminError)
        throw adminError
      }

      if (adminProfile?.is_admin) {
        navigate('/admin')
        return
      }

      // Then check if user is a contractor
      const { data: contractor, error: contractorError } = await supabase
        .from('contractors')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (contractorError) {
        console.error('Error checking contractor status:', contractorError)
        throw contractorError
      }

      if (contractor) {
        navigate('/contractor-dashboard')
        return
      }

      // If neither admin nor contractor, redirect to client dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Error in auth redirect:', error)
      // On error, redirect to dashboard as fallback
      navigate('/dashboard')
    }
  }

  return handleRedirect
}