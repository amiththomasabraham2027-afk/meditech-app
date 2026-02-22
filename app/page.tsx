'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = (role: 'patient' | 'doctor') => {
    setLoading(true);
    // Store selected role
    localStorage.setItem('selected_role', role);
    
    if (user) {
      router.push(role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
    } else {
      router.push('/role-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Meditech</h1>
          <p className="text-xl text-gray-600">
            Professional Telemedicine Platform
          </p>
        </div>

        <p className="text-gray-600 mb-8">
          Connect with healthcare professionals and manage your medical needs all in one place.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection('patient')}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            I'm a Patient
          </button>
          <button
            onClick={() => handleRoleSelection('doctor')}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            I'm a Doctor
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          This is a demonstration platform. Use test credentials to log in.
        </p>
      </div>
    </div>
  );
}
