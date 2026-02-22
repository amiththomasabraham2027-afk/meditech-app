'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header, Sidebar, LoadingSpinner } from '@/components';

export default function DoctorMessages() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="doctor" />
        <div className="flex-1">
          <Header title="Messages" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner message="Loading..." />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="doctor" />

      <div className="flex-1">
        <Header title="Messages" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Messages</h2>
            <p className="text-gray-600">
              Real-time messaging feature coming soon. Use appointment-based conversations.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
