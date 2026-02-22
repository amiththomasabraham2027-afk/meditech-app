'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { LoadingSpinner } from '@/components';

export default function RoleSelection() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'role' | 'profile'>('role');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleRoleSelect = (selectedRole: 'patient' | 'doctor') => {
    setRole(selectedRole);
    setStep('profile');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!role || !formData.name || !formData.email || !formData.phone) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      const user = await userService.createUserProfile(
        formData.email,
        formData.name,
        formData.phone,
        role
      );

      login(user);
      router.push(role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
      setLoading(false);
    }
  };

  if (step === 'role') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600 mb-8">
            Select your role to get started with Meditech
          </p>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect('patient')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              <div className="text-2xl mb-2">👤</div>
              I'm a Patient
            </button>
            <button
              onClick={() => handleRoleSelect('doctor')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
            >
              <div className="text-2xl mb-2">👨‍⚕️</div>
              I'm a Doctor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your {role === 'patient' ? 'Patient' : 'Doctor'} Profile
        </h1>
        <p className="text-gray-600 mb-6">
          Tell us about yourself to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => setStep('role')}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
