export type UserRole = 'patient' | 'doctor' | null;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Hospital {
  id: string;
  name: string;
  created_at: string;
}

export interface Department {
  id: string;
  hospital_id: string;
  name: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  hospital_id: string;
  specialization: string;
  name?: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  image_url: string;
  prescription_text?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  appointment_id?: string;
  message: string;
  created_at: string;
  read_at?: string;
}

export interface DashboardQuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  route: string;
}
