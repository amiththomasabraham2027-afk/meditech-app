'use client';

import React from 'react';
import { Doctor } from '@/models/types';
import { Star } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor & { users_profile?: any };
  onSelect?: (doctorId: string) => void;
  selected?: boolean;
}

export function DoctorCard({ doctor, onSelect, selected }: DoctorCardProps) {
  const profile = doctor.users_profile || {};

  return (
    <div
      onClick={() => onSelect?.(doctor.id)}
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:shadow-md hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{profile.name || 'Doctor'}</h3>
          <p className="text-sm text-blue-600 font-medium">
            {doctor.specialization}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">4.8</span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {profile.email && (
          <p>{profile.email}</p>
        )}
        {profile.phone && (
          <p>{profile.phone}</p>
        )}
      </div>

      {selected && (
        <div className="mt-3 pt-3 border-t border-blue-300">
          <p className="text-sm font-medium text-blue-600">Selected</p>
        </div>
      )}
    </div>
  );
}
