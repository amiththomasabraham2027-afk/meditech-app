import { supabase } from '@/lib/supabaseClient';
import { Message } from '@/models/types';

export const messageService = {
  async sendMessage(
    senderId: string,
    receiverId: string,
    message: string,
    appointmentId?: string
  ) {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          message,
          appointment_id: appointmentId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  },

  async getConversation(userId1: string, userId2: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`
      )
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Message[];
  },

  async getConversationByAppointment(appointmentId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Message[];
  },

  async markMessageAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  },

  subscribeToMessages(
    userId: string,
    callback: (message: Message) => void
  ) {
    const subscription = supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return subscription;
  },
};
