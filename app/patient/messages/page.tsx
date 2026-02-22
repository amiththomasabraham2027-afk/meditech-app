'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header, Sidebar, MessageBubble, LoadingSpinner } from '@/components';
import { messageService } from '@/services/messageService';
import { appointmentService } from '@/services/appointmentService';
import { Message, Appointment } from '@/models/types';
import { Send } from 'lucide-react';

export default function PatientMessages() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/role-selection');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  useEffect(() => {
    if (selectedAppointmentId) {
      fetchMessages();
    }
  }, [selectedAppointmentId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getPatientAppointments(user.id);
      setAppointments(data);
      if (data.length > 0) {
        setSelectedAppointmentId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedAppointmentId) return;
    try {
      const data = await messageService.getConversationByAppointment(
        selectedAppointmentId
      );
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedAppointmentId) return;

    setSending(true);
    try {
      const appointment = appointments.find((a) => a.id === selectedAppointmentId);
      if (!appointment) throw new Error('Appointment not found');

      const message = await messageService.sendMessage(
        user.id,
        appointment.doctor_id,
        messageText,
        selectedAppointmentId
      );

      setMessages([...messages, message]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="patient" />
        <div className="flex-1">
          <Header title="Messages" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
        <Header title="Messages" showMenu onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen">
            {/* Conversation List */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Conversations</h3>
              </div>
              <div className="overflow-y-auto h-full">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAppointmentId(apt.id)}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      selectedAppointmentId === apt.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium text-sm">Doctor</p>
                    <p className="text-xs text-gray-600">
                      {new Date(apt.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow flex flex-col overflow-hidden">
              {selectedAppointmentId ? (
                <>
                  <div className="flex-1 overflow-y-auto p-6">
                    {messages.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">
                        No messages yet. Start a conversation!
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <MessageBubble
                          key={msg.id}
                          message={msg}
                          isOwn={msg.sender_id === user.id}
                        />
                      ))
                    )}
                  </div>

                  <div className="border-t p-4 bg-gray-50">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sending || !messageText.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">
                    {appointments.length === 0
                      ? 'No appointments yet'
                      : 'Select a conversation to start messaging'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
