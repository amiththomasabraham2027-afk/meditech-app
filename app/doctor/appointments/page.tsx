'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header, Sidebar, AppointmentCard, LoadingSpinner } from '@/components';
import { appointmentService } from '@/services/appointmentService';
import { userService } from '@/services/userService';
import { Appointment, UserProfile } from '@/models/types';

export default function DoctorAppointments() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<(Appointment & { patient?: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getDoctorAppointments(user.id);
      
      // Fetch patient details for each appointment
      const appointmentsWithPatients = await Promise.all(
        data.map(async (apt) => {
          const patient = await userService.getUserProfile(apt.patient_id);
          return { ...apt, patient };
        })
      );

      setAppointments(appointmentsWithPatients);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, status: Appointment['status']) => {
    setUpdating(true);
    try {
      const updated = await appointmentService.updateAppointmentStatus(
        appointmentId,
        status
      );

      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, ...updated } : apt
        )
      );
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment status');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="doctor" />
        <div className="flex-1">
          <Header title="Appointments" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
        <Header title="Appointments" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Waiting for Consultation</p>
              <p className="text-3xl font-bold text-yellow-600">
                {appointments.filter((a) => a.status === 'scheduled').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">
                {appointments.filter((a) => a.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {appointments.filter((a) => a.status === 'completed').length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">All Appointments</h2>

            {appointments.length === 0 ? (
              <p className="text-gray-600">No appointments yet.</p>
            ) : (
              appointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  isDoctorView={true}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
