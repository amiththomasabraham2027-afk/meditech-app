'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header, Sidebar, FileUpload, LoadingSpinner } from '@/components';
import { storageService } from '@/services/storageService';

export default function DoctorSettings() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection');
    }
  }, [user, authLoading, router]);

  const handleUploadLogo = async () => {
    if (!logo) return;

    setUploading(true);
    setMessage(null);

    try {
      const publicUrl = await storageService.uploadLogo(logo);
      setLogoUrl(publicUrl);
      setLogo(null);
      setMessage({ type: 'success', text: 'Logo uploaded successfully!' });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to upload logo',
      });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="doctor" />
        <div className="flex-1">
          <Header title="Settings" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
        <Header title="Settings" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Application Logo</h2>

              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <p className="text-gray-600 mb-6">
                Upload your application logo. This will be used for watermarking prescriptions.
              </p>

              <div className="space-y-4">
                {logoUrl && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Logo</p>
                    <img
                      src={logoUrl}
                      alt="Current Logo"
                      className="h-20 w-20 object-contain border rounded-lg p-2"
                    />
                  </div>
                )}

                <FileUpload
                  onFileSelect={setLogo}
                  accept="image/*"
                  maxSizeMB={5}
                  label="Select Logo Image"
                />

                <button
                  onClick={handleUploadLogo}
                  disabled={!logo || uploading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                </button>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-bold mb-4">Profile Information</h3>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
