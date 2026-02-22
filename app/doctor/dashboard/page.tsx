'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header, Sidebar, DoctorDashboardButtons, LoadingSpinner } from '@/components';
import { appointmentService } from '@/services/appointmentService';

export default function DoctorDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointmentStats, setAppointmentStats] = useState({
    waiting: 0,
    upcoming: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // This is a placeholder - in a real app, you'd fetch actual appointments for this doctor
      const appointments = await appointmentService.getDoctorAppointments(user.id);
      const waiting = appointments.filter((a) => a.status === 'scheduled').length;
      const upcoming = appointments.filter((a) => a.status === 'in-progress').length;
      const completed = appointments.filter((a) => a.status === 'completed').length;

      setAppointmentStats({ waiting, upcoming, completed });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="doctor" />
        <div className="flex-1">
          <Header title="Dashboard" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
        <Header title="Dashboard" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, Dr. {user.name}! 👋
            </h2>
            <p className="text-gray-600">
              Manage your patients and appointments efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Waiting for Consultation</p>
              <p className="text-3xl font-bold text-blue-600">
                {appointmentStats.waiting}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Upcoming Appointments</p>
              <p className="text-3xl font-bold text-green-600">
                {appointmentStats.upcoming}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Completed Visits</p>
              <p className="text-3xl font-bold text-purple-600">
                {appointmentStats.completed}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Patients</p>
              <p className="text-3xl font-bold text-orange-600">0</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h3>
            <DoctorDashboardButtons />
          </div>
        </main>
      </div>
    </div>
  );
}
