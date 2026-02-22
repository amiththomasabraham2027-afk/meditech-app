import { supabase } from '@/lib/supabaseClient';
import { Prescription } from '@/models/types';

export const prescriptionService = {
  async uploadPrescription(
    patientId: string,
    doctorId: string,
    file: File,
    prescriptionText?: string
  ) {
    const fileName = `${patientId}/${doctorId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('prescriptions')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from('prescriptions').getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('prescriptions')
      .insert([
        {
          patient_id: patientId,
          doctor_id: doctorId,
          image_url: publicUrl,
          prescription_text: prescriptionText,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Prescription;
  },

  async getPatientPrescriptions(patientId: string) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Prescription[];
  },

  async getDoctorPatientsForPrescription(doctorId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('patient_id, patients:users_profile(id, name, email)')
      .eq('doctor_id', doctorId)
      .eq('status', 'in-progress');

    if (error) throw error;
    return data;
  },
};
