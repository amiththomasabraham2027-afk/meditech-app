'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header, Sidebar, RecordCard, FileUpload, LoadingSpinner } from '@/components';
import { recordService } from '@/services/recordService';
import { MedicalRecord } from '@/models/types';

export default function PatientMedicalRecords() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await recordService.getPatientRecords(user.id);
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const record = await recordService.uploadMedicalRecord(
        user.id,
        selectedFile,
        user.id
      );

      setRecords([record, ...records]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading record:', error);
      alert('Failed to upload record');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await recordService.deleteRecord(recordId);
      setRecords(records.filter((r) => r.id !== recordId));
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="patient" />
        <div className="flex-1">
          <Header title="Medical Records" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
        <Header title="Medical Records" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Your Medical Records</h2>

                {records.length === 0 ? (
                  <p className="text-gray-600">No medical records yet.</p>
                ) : (
                  records.map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      onDelete={handleDelete}
                      onDownload={(rec) => window.open(rec.file_url)}
                    />
                  ))
                )}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h3 className="text-lg font-bold mb-4">Upload Record</h3>

                <FileUpload
                  onFileSelect={setSelectedFile}
                  accept="image/*,.pdf"
                  maxSizeMB={50}
                  label="Select Medical Record"
                />

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Record'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
