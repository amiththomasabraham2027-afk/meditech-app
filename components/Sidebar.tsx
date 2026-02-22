'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  X,
  Pill,
  Users,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'patient' | 'doctor';
}

export function Sidebar({ isOpen, onClose, role }: SidebarProps) {
  const pathname = usePathname();

  const patientItems: NavItem[] = [
    {
      label: 'Appointments',
      href: '/patient/appointments',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'Medical Records',
      href: '/patient/medical-records',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: 'Messages',
      href: '/patient/messages',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      href: '/patient/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const doctorItems: NavItem[] = [
    {
      label: 'Appointments',
      href: '/doctor/appointments',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'Patient Records',
      href: '/doctor/patient-records',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Messages',
      href: '/doctor/messages',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: 'Prescriptions',
      href: '/doctor/prescriptions',
      icon: <Pill className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      href: '/doctor/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const navItems = role === 'patient' ? patientItems : doctorItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50 md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-blue-600">Meditech</h2>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
