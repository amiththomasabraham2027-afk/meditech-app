import { supabase } from '@/lib/supabaseClient';
import { MedicalRecord } from '@/models/types';

export const recordService = {
  async uploadMedicalRecord(
    patientId: string,
    file: File,
    uploadedBy: string
  ) {
    const fileName = `${patientId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('medical-records')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from('medical-records').getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('medical_records')
      .insert([
        {
          patient_id: patientId,
          file_url: publicUrl,
          file_name: file.name,
          file_type: file.type,
          uploaded_by: uploadedBy,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as MedicalRecord;
  },

  async getPatientRecords(patientId: string) {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as MedicalRecord[];
  },

  async deleteRecord(recordId: string) {
    const { error } = await supabase
      .from('medical_records')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
  },
};
