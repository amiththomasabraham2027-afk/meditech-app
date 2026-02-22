'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header, Sidebar, RecordCard, LoadingSpinner } from '@/components';
import { appointmentService } from '@/services/appointmentService';
import { recordService } from '@/services/recordService';
import { MedicalRecord } from '@/models/types';

export default function DoctorPatientRecords() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientList, setPatientList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPatients();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPatientId) {
      fetchPatientRecords();
    }
  }, [selectedPatientId]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const appointments = await appointmentService.getDoctorAppointments(user.id);
      const uniquePatients = [
        ...new Map(
          appointments.map((apt) => [apt.patient_id, apt.patient_id])
        ).keys(),
      ];
      
      // In a real app, you'd fetch patient details here
      setPatientList(
        uniquePatients.map((id) => ({
          id,
          name: `Patient ${id.substring(0, 8)}`,
        }))
      );

      if (uniquePatients.length > 0) {
        setSelectedPatientId(uniquePatients[0]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientRecords = async () => {
    if (!selectedPatientId) return;
    try {
      const data = await recordService.getPatientRecords(selectedPatientId);
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="doctor" />
        <div className="flex-1">
          <Header title="Patient Records" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
        <Header title="Patient Records" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Patient List */}
            <div className="bg-white rounded-lg shadow overflow-hidden h-fit">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">My Patients</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {patientList.length === 0 ? (
                  <p className="p-4 text-gray-600 text-sm">No patients yet</p>
                ) : (
                  patientList.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={`p-4 border-b cursor-pointer transition-colors ${
                        selectedPatientId === patient.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-sm">{patient.name}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Records List */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Patient Records</h2>

              {records.length === 0 ? (
                <p className="text-gray-600">
                  {selectedPatientId
                    ? 'No records for this patient'
                    : 'Select a patient to view records'}
                </p>
              ) : (
                records.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onDownload={(rec) => window.open(rec.file_url)}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
