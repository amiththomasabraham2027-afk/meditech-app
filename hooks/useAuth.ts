'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { userService } from '@/services/userService';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      // First try localStorage for fast render
      const cached = localStorage.getItem('user_profile');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('user_profile');
        }
      }

      // Fall back to Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const profile = await userService.getUserProfile(session.user.id);
          if (profile) {
            localStorage.setItem('user_profile', JSON.stringify(profile));
            setUser(profile);
          }
        } catch {
          // No profile yet — leave user as null
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth state changes (e.g. session expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('user_profile');
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = (userProfile: any) => {
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
    setUser(userProfile);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user_profile');
    setUser(null);
    router.push('/');
  };

  return { user, loading, error, login, logout };
}
