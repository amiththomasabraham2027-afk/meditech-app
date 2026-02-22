import { supabase } from '@/lib/supabaseClient';
import { UserProfile, UserRole } from '@/models/types';

export const userService = {
  async createUserProfile(
    email: string,
    name: string,
    phone: string,
    role: UserRole
  ) {
    const { data, error } = await supabase
      .from('users_profile')
      .insert([
        {
          name,
          email,
          phone,
          role,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as UserProfile;
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('users_profile')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as UserProfile | null;
  },
};
