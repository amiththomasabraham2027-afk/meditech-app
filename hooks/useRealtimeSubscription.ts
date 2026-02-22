'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSubscription(
  table: string,
  userId: string,
  onMessage?: (payload: any) => void
) {
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = useCallback(() => {
    const channel = supabase
      .channel(`${table}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          onMessage?.(payload);
        }
      )
      .subscribe();

    setSubscription(channel);
    setIsSubscribed(true);
  }, [table, userId, onMessage]);

  const unsubscribe = useCallback(() => {
    if (subscription) {
      supabase.removeChannel(subscription);
      setIsSubscribed(false);
    }
  }, [subscription]);

  return { isSubscribed, subscribe, unsubscribe };
}
