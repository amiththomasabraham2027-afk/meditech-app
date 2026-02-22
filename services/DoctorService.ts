import { supabase } from '@/lib/supabaseClient';
import { Doctor } from '@/models/types';

export const doctorService = {
  async createDoctor(
    doctorId: string,
    email: string,
    name: string,
    specialty?: string
  ) {
    const { data, error } = await supabase
      .from('doctors')
      .insert([
        {
          doctor_id: doctorId,
          email,
          name,
          specialty,
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
      .select('*')
      .eq('specialty', specialization);

    if (error) throw error;
    return data;
  },

  async getDoctorsByHospital(hospitalId: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('hospital_id', hospitalId);

    if (error) throw error;
    return data;
  },

  async getDoctorProfile(userId: string) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', userId)
      .single();

    if (error) throw error;
    return data as Doctor;
  },
};
