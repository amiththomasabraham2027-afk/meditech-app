'use client';

import React from 'react';
import { Calendar, FileText, MessageSquare, Settings } from 'lucide-react';
import Link from 'next/link';

interface DashboardButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

export function DashboardButton({
  icon,
  title,
  description,
  href,
  color,
}: DashboardButtonProps) {
  return (
    <Link href={href}>
      <div
        className={`${color} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full`}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-gray-100">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PatientDashboardButtons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <DashboardButton
        icon={<Calendar className="w-8 h-8" />}
        title="My Appointments"
        description="Book and manage appointments"
        href="/patient/appointments"
        color="bg-gradient-to-br from-blue-500 to-blue-600"
      />
      <DashboardButton
        icon={<FileText className="w-8 h-8" />}
        title="Medical Records"
        description="View your medical history"
        href="/patient/medical-records"
        color="bg-gradient-to-br from-green-500 to-green-600"
      />
      <DashboardButton
        icon={<MessageSquare className="w-8 h-8" />}
        title="Messages"
        description="Chat with doctors"
        href="/patient/messages"
        color="bg-gradient-to-br from-purple-500 to-purple-600"
      />
      <DashboardButton
        icon={<Settings className="w-8 h-8" />}
        title="Settings"
        description="Update your profile"
        href="/patient/settings"
        color="bg-gradient-to-br from-orange-500 to-orange-600"
      />
    </div>
  );
}

export function DoctorDashboardButtons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <DashboardButton
        icon={<Calendar className="w-8 h-8" />}
        title="Appointments"
        description="Manage patient appointments"
        href="/doctor/appointments"
        color="bg-gradient-to-br from-blue-500 to-blue-600"
      />
      <DashboardButton
        icon={<FileText className="w-8 h-8" />}
        title="Patient Records"
        description="View patient medical records"
        href="/doctor/patient-records"
        color="bg-gradient-to-br from-green-500 to-green-600"
      />
      <DashboardButton
        icon={<MessageSquare className="w-8 h-8" />}
        title="Messages"
        description="Chat with patients"
        href="/doctor/messages"
        color="bg-gradient-to-br from-purple-500 to-purple-600"
      />
      <DashboardButton
        icon={<FileText className="w-8 h-8" />}
        title="Prescriptions"
        description="Upload prescriptions"
        href="/doctor/prescriptions"
        color="bg-gradient-to-br from-red-500 to-red-600"
      />
    </div>
  );
}
