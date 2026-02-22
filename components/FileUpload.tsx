'use client';

import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  error?: string;
  loading?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = '*',
  maxSizeMB = 10,
  label = 'Upload File',
  error,
  loading,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(error || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setLocalError(null);

    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />

        {!file ? (
          <>
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-xs text-gray-500 mt-1">
              Click to browse or drag and drop
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              disabled={loading}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {(localError || error) && (
        <p className="text-sm text-red-600 mt-2">{localError || error}</p>
      )}
    </div>
  );
}
