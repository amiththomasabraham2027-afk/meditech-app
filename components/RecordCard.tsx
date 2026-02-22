'use client';

import React from 'react';
import { MedicalRecord } from '@/models/types';
import { Download, Trash2 } from 'lucide-react';

interface RecordCardProps {
  record: MedicalRecord;
  onDelete?: (recordId: string) => void;
  onDownload?: (record: MedicalRecord) => void;
}

export function RecordCard({ record, onDelete, onDownload }: RecordCardProps) {
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg break-words">{record.file_name}</h3>
          <p className="text-sm text-gray-600">
            Uploaded by: {record.uploaded_by}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(record.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {record.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
        </span>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onDownload?.(record)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(record.id)}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
