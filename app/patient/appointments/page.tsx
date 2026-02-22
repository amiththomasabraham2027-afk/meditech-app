'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header, Sidebar, AppointmentCard, DoctorCard, LoadingSpinner } from '@/components';
import { appointmentService } from '@/services/appointmentService';
import { doctorService } from '@/services/DoctorService';
import { hospitalService } from '@/services/hospitalService';
import { Appointment, Doctor } from '@/models/types';

export default function PatientAppointments() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [view, setView] = useState<'list' | 'book'>('list');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAppointmentsAndDoctors();
    }
  }, [user]);

  const fetchAppointmentsAndDoctors = async () => {
    try {
      setLoading(true);
      const [appointments, doctors] = await Promise.all([
        appointmentService.getPatientAppointments(user.id),
        hospitalService.getAllDepartments().then(async (depts) => {
          let allDoctors: Doctor[] = [];
          for (const dept of depts) {
            const deptDoctors = await doctorService.getDoctorsByHospital(dept.id);
            allDoctors = [...allDoctors, ...deptDoctors];
          }
          return allDoctors;
        }),
      ]);

      setAppointments(appointments);
      setDoctors(doctors);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate) {
      alert('Please select a doctor and appointment date');
      return;
    }

    setSubmitting(true);
    try {
      const appointment = await appointmentService.createAppointment(
        user.id,
        selectedDoctor,
        appointmentDate,
        notes
      );

      setAppointments([...appointments, appointment]);
      setSelectedDoctor(null);
      setAppointmentDate('');
      setNotes('');
      setView('list');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="patient" />
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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="patient" />

      <div className="flex-1">
        <Header title="Appointments" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setView('list')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              My Appointments
            </button>
            <button
              onClick={() => setView('book')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                view === 'book'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Book Appointment
            </button>
          </div>

          {view === 'list' ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Your Appointments</h2>
              {appointments.length === 0 ? (
                <p className="text-gray-600">No appointments yet. Book your first appointment!</p>
              ) : (
                appointments.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    selected={selectedDoctor === doctor.id}
                    onSelect={setSelectedDoctor}
                  />
                ))}
              </div>

              {selectedDoctor && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        rows={4}
                        placeholder="Any specific symptoms or concerns..."
                      />
                    </div>

                    <button
                      onClick={handleBookAppointment}
                      disabled={submitting}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
