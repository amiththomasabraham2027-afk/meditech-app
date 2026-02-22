'use client';

import React from 'react';
import { Appointment, UserProfile } from '@/models/types';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment & { doctor?: UserProfile; patient?: UserProfile };
  isDoctorView?: boolean;
  onStatusChange?: (appointmentId: string, status: Appointment['status']) => void;
}

export function AppointmentCard({
  appointment,
  isDoctorView,
  onStatusChange,
}: AppointmentCardProps) {
  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const date = new Date(appointment.date);
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">
            {isDoctorView ? appointment.patient?.full_name : appointment.doctor?.full_name || 'Doctor'}
          </h3>
          <p className="text-sm text-gray-600">
            {dateStr} at {timeStr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(appointment.status)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
      </div>

      {appointment.notes && (
        <p className="text-sm text-gray-700 mb-3">{appointment.notes}</p>
      )}

      {isDoctorView && (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() =>
              onStatusChange?.(appointment.id, 'in-progress')
            }
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Start
          </button>
          <button
            onClick={() =>
              onStatusChange?.(appointment.id, 'completed')
            }
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Complete
          </button>
          <button
            onClick={() =>
              onStatusChange?.(appointment.id, 'cancelled')
            }
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
