import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  role: z.enum(['patient', 'doctor']),
});

export const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  date: z.string().refine(
    (date) => new Date(date) > new Date(),
    'Appointment date must be in the future'
  ),
  notes: z.string().optional(),
});

export const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000),
});

export const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  file: z.instanceof(File),
  prescriptionText: z.string().optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
