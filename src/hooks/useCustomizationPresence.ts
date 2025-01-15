import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PresenceState {
  user_id: string;
  last_seen: string;
  viewing_section: string;
}

export function useCustomizationPresence(floorPlanId: string) {
  const [activeUsers, setActiveUsers] = useState<PresenceState[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`customization:${floorPlanId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setActiveUsers(Object.values(state).flat() as PresenceState[]);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            last_seen: new Date().toISOString(),
            viewing_section: 'customization'
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [floorPlanId]);

  return activeUsers;
}