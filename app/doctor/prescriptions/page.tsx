'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header, Sidebar, FileUpload, LoadingSpinner } from '@/components';
import { appointmentService } from '@/services/appointmentService';
import { prescriptionService } from '@/services/prescriptionService';
import { storageService } from '@/services/storageService';
import { Prescription } from '@/models/types';

export default function DoctorPrescriptions() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patientList, setPatientList] = useState<{ id: string; name: string }[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

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
      fetchPrescriptions();
    }
  }, [selectedPatientId]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const appointments = await appointmentService.getDoctorAppointments(user.id);
      const uniquePatients = [
        ...new Map(
          appointments
            .filter((a) => a.status === 'scheduled' || a.status === 'in-progress')
            .map((apt) => [apt.patient_id, apt.patient_id])
        ).keys(),
      ];

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

  const fetchPrescriptions = async () => {
    if (!selectedPatientId) return;
    try {
      const data = await prescriptionService.getPatientPrescriptions(
        selectedPatientId
      );
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleUploadPrescription = async () => {
    if (!selectedFile || !selectedPatientId) return;

    setUploading(true);
    try {
      const prescription = await prescriptionService.uploadPrescription(
        selectedPatientId,
        user.id,
        selectedFile
      );

      setPrescriptions([prescription, ...prescriptions]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading prescription:', error);
      alert('Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="doctor" />
        <div className="flex-1">
          <Header title="Prescriptions" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
        <Header title="Prescriptions" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Patient List */}
            <div className="bg-white rounded-lg shadow overflow-hidden h-fit">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Waiting Patients</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {patientList.length === 0 ? (
                  <p className="p-4 text-gray-600 text-sm">
                    No patients waiting for prescription
                  </p>
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

            {/* Prescription Upload */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Upload Prescription</h2>

                {selectedPatientId ? (
                  <div className="space-y-4">
                    <FileUpload
                      onFileSelect={setSelectedFile}
                      accept="image/*,.pdf"
                      maxSizeMB={50}
                      label="Select Prescription Image"
                    />

                    <button
                      onClick={handleUploadPrescription}
                      disabled={!selectedFile || uploading}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload Prescription'}
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600">Select a patient to upload a prescription</p>
                )}
              </div>

              {/* Prescription History */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Prescription History</h3>

                {prescriptions.length === 0 ? (
                  <p className="text-gray-600">No prescriptions yet</p>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div
                        key={prescription.id}
                        className="border rounded-lg p-4 flex justify-between items-start"
                      >
                        <div>
                          <p className="font-medium">Prescription ID: {prescription.id.substring(0, 8)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(prescription.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <a
                          href={prescription.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
