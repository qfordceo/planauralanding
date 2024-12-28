import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Session } from "@supabase/supabase-js"

export const useAuthRedirect = () => {
  const navigate = useNavigate()

  const handleRedirect = async (session: Session | null) => {
    if (!session) return

    // First check if user is an admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (profile?.is_admin) {
      navigate('/admin')
      return
    }

    // Then check if user is a contractor
    const { data: contractor } = await supabase
      .from('contractors')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    if (contractor) {
      navigate('/contractor-dashboard')
      return
    }

    // If neither admin nor contractor, redirect to client dashboard
    navigate('/dashboard')
  }

  return handleRedirect
}