'use client';

import React from 'react';
import { Message } from '@/models/types';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
}

export function MessageBubble({
  message,
  isOwn,
  senderName,
}: MessageBubbleProps) {
  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {!isOwn && senderName && (
          <p className="text-xs font-semibold mb-1 opacity-75">
            {senderName}
          </p>
        )}
        <p className="text-sm">{message.message}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {format(new Date(message.created_at), 'HH:mm')}
        </p>
      </div>
    </div>
  );
}
