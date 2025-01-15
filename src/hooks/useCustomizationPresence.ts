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
        const presenceArray = Object.values(state).flat().map(presence => {
          const presenceData = presence as any;
          return {
            user_id: presenceData.user_id || '',
            last_seen: presenceData.last_seen || new Date().toISOString(),
            viewing_section: presenceData.viewing_section || 'customization'
          };
        });
        setActiveUsers(presenceArray);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          await channel.track({
            user_id: user?.id,
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