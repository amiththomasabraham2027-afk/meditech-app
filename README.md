# Meditech - Telemedicine Platform

A production-ready telemedicine web application built with Next.js 15, TypeScript, Supabase, and Tailwind CSS.

## Features

### Patient Dashboard
- **My Appointments**: Browse departments, view available doctors, and book appointments
- **Medical Records**: Upload and manage medical documents  
- **Messages**: Real-time chat with doctors using Supabase Realtime
- **Settings**: Update personal profile information

### Doctor Dashboard
- **Appointments**: Manage patient consultations with status tracking
- **Patient Records**: Access and download patient medical records
- **Messages**: Real-time communication with patients
- **Prescriptions**: Upload prescriptions with automatic watermarking using logo
- **Settings**: Upload and manage application logo

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Framework**: React with Tailwind CSS  
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Form Validation**: Zod
- **Image Processing**: Sharp

## Project Structure

```
meditech-app/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home/role selection page
│   ├── role-selection/          # Role selection flow
│   ├── patient/                 # Patient routes
│   │   ├── dashboard/
│   │   ├── appointments/
│   │   ├── medical-records/
│   │   ├── messages/
│   │   └── settings/
│   ├── doctor/                  # Doctor routes  
│   │   ├── dashboard/
│   │   ├── appointments/
│   │   ├── patient-records/
│   │   ├── messages/
│   │   ├── prescriptions/
│   │   └── settings/
│   └── globals.css
│
├── components/                   # Reusable React components
├── services/                     # Supabase service layer
├── hooks/                        # Custom React hooks
├── models/                       # TypeScript types
├── utils/                        # Utility functions
├── lib/supabaseClient.ts         # Supabase client
├── public/                       # Static assets
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase URL and API keys

3. **Create database tables** (SQL in Supabase dashboard):
   
   ```sql
   CREATE TABLE users_profile (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     phone TEXT,
     role TEXT CHECK (role IN ('patient', 'doctor')),
     created_at TIMESTAMP DEFAULT now(),
     updated_at TIMESTAMP DEFAULT now()
   );

   CREATE TABLE hospitals (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT now()
   );

   CREATE TABLE departments (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     hospital_id UUID REFERENCES hospitals(id),
     name TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT now()
   );

   CREATE TABLE doctors (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES users_profile(id),
     hospital_id UUID REFERENCES hospitals(id),
     specialization TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT now()
   );

   CREATE TABLE appointments (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     patient_id UUID REFERENCES users_profile(id),
     doctor_id UUID REFERENCES doctors(id),
     status TEXT CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
     date TIMESTAMP NOT NULL,
     notes TEXT,
     created_at TIMESTAMP DEFAULT now(),
     updated_at TIMESTAMP DEFAULT now()
   );

   CREATE TABLE medical_records (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     patient_id UUID REFERENCES users_profile(id),
     file_url TEXT NOT NULL,
     file_name TEXT NOT NULL,
     file_type TEXT,
     uploaded_by UUID REFERENCES users_profile(id),
     created_at TIMESTAMP DEFAULT now()
   );

   CREATE TABLE prescriptions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     patient_id UUID REFERENCES users_profile(id),
     doctor_id UUID REFERENCES doctors(id),
     image_url TEXT NOT NULL,
     prescription_text TEXT,
     created_at TIMESTAMP DEFAULT now()
   );

   CREATE TABLE messages (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     sender_id UUID REFERENCES users_profile(id),
     receiver_id UUID REFERENCES users_profile(id),
     appointment_id UUID REFERENCES appointments(id),
     message TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT now(),
     read_at TIMESTAMP
   );
   ```

4. **Create Storage buckets** in Supabase:
   - `medical-records` (public)
   - `prescriptions` (public)
   - `logos` (public)

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Usage

### Patient Flow
1. Click "I'm a Patient" → Create profile
2. Access dashboard with 4 sections
3. Book appointments with doctors
4. Upload/manage medical records
5. Chat with doctors in real-time

### Doctor Flow  
1. Click "I'm a Doctor" → Create profile
2. Access dashboard with 5 sections
3. Manage patient appointments
4. View patient records
5. Upload prescriptions (auto-watermarked)

## Key Features

### Real-time Messaging
- Supabase Realtime for instant updates
- Message history per appointment
- Read status tracking

### File Management
- Secure uploads to Supabase Storage
- Automatic file validation
- File type detection

### Watermarking
- Prescriptions marked with doctor's logo
- Sharp-based image processing
- Quality preservation

## Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## License

MIT License

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
