import { supabase } from '@/lib/supabaseClient';
import { Hospital, Department } from '@/models/types';

export const hospitalService = {
  async getAllHospitals() {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*');

    if (error) throw error;
    return data as Hospital[];
  },

  async getHospitalById(hospitalId: string) {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', hospitalId)
      .single();

    if (error) throw error;
    return data as Hospital;
  },

  async getDepartmentsByHospital(hospitalId: string) {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('hospital_id', hospitalId);

    if (error) throw error;
    return data as Department[];
  },

  async getAllDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select('*');

    if (error) throw error;
    return data as Department[];
  },
};
