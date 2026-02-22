'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for user data
    const userStr = localStorage.getItem('user_profile');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (err) {
        setError('Failed to parse user data');
      }
    }
    setLoading(false);
  }, []);

  const login = (userProfile: any) => {
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
    setUser(userProfile);
  };

  const logout = () => {
    localStorage.removeItem('user_profile');
    setUser(null);
    router.push('/');
  };

  return { user, loading, error, login, logout };
}
