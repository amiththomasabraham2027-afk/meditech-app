import { supabase } from '@/lib/supabaseClient';
import { Doctor } from '@/models/types';

export const doctorService = {
  async createDoctor(
    userId: string,
    hospitalId: string,
    specialization: string
  ) {
    const { data, error } = await supabase
      .from('doctors')
      .insert([
        {
          user_id: userId,
          hospital_id: hospitalId,
          specialization,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Doctor;
  },

  async getDoctorsBySpecialization(specialization: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, users_profile(*)')
      .eq('specialization', specialization);

    if (error) throw error;
    return data;
  },

  async getDoctorsByHospital(hospitalId: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, users_profile(*)')
      .eq('hospital_id', hospitalId);

    if (error) throw error;
    return data;
  },

  async getDoctorProfile(userId: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as Doctor;
  },
};
