'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // If already logged in, redirect to their dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace(
        user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'
      );
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Meditech</h1>
          <p className="text-xl text-gray-600">Professional Telemedicine Platform</p>
        </div>

        <p className="text-gray-600 mb-8">
          Connect with healthcare professionals and manage your medical needs all in one place.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/role-selection')}
            className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Create Account
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Telemedicine platform for patients and doctors.
        </p>
      </div>
    </div>
  );
}


