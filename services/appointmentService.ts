import { supabase } from '@/lib/supabaseClient';
import { Appointment } from '@/models/types';

export const appointmentService = {
  async createAppointment(
    patientId: string,
    doctorId: string,
    date: string,
    notes?: string
  ) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: patientId,
          doctor_id: doctorId,
          date,
          notes,
          status: 'scheduled',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  async getPatientAppointments(patientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data as Appointment[];
  },

  async getDoctorAppointments(doctorId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data as Appointment[];
  },

  async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment['status']
  ) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  async getAppointmentById(appointmentId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (error) throw error;
    return data as Appointment;
  },
};
