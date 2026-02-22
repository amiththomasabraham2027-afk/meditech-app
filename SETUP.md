# Meditech Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd meditech-app
npm install
```

### 2. Configure Supabase
- Create account at https://supabase.com
- Create new project
- Copy URL and API keys
- Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Setup Database
Go to SQL Editor in Supabase dashboard and run:

```sql
-- Users/Profiles
CREATE TABLE IF NOT EXISTS users_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('patient', 'doctor')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Doctors
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  date TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Medical Records
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID REFERENCES users_profile(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  prescription_text TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  read_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users_profile(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users_profile(role);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
```

### 4. Create Storage Buckets
In Supabase Storage, create these public buckets:
- `medical-records`
- `prescriptions`
- `logos`

### 5. Enable Realtime
In Supabase Dashboard:
- Go to Replication Settings
- Enable Realtime for `messages` table

### 6. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Testing the Application

### Patient Account
1. Click "I'm a Patient"
2. Fill signup form (use test data)
3. Access dashboard
4. Try booking appointment
5. Upload medical record
6. Send message to doctor

### Doctor Account  
1. Click "I'm a Doctor"
2. Fill signup form (use test data)
3. Access dashboard
4. View appointments
5. Upload prescription with watermark
6. Upload logo in settings

## Project Structure

```
meditech-app/
├── app/                  # Next.js routes
│   ├── patient/         # Patient pages
│   ├── doctor/          # Doctor pages
│   ├── role-selection/  # Auth flow
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
│
├── components/          # React components
│   ├── DashboardButtons.tsx
│   ├── AppointmentCard.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── ... more components
│
├── services/            # Supabase integration
│   ├── userService.ts
│   ├── appointmentService.ts
│   ├── messageService.ts
│   └── ... more services
│
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   └── useRealtimeSubscription.ts
│
├── models/              # TypeScript types
│   └── types.ts
│
├── utils/               # Helper functions
│   ├── validation.ts
│   └── errorHandler.ts
│
└── lib/
    └── supabaseClient.ts
```

## Features Checklist

### Patient Features
- [x] Role selection and signup
- [x] Profile management
- [x] Book appointments
- [x] View physicians
- [x] Upload medical records
- [x] View medical records
- [x] Real-time messaging with doctors
- [x] Responsive design

### Doctor Features
- [x] Role selection and signup
- [x] View appointments
- [x] Update appointment status
- [x] View patient records
- [x] Upload prescriptions
- [x] Real-time messaging with patients
- [x] Logo management for watermarks
- [x] Responsive design

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type check
npm run type-check
```

## Troubleshooting

### "Cannot find module '@/components'"
- Ensure `tsconfig.json` has path alias configured
- Restart development server

### Supabase connection fails
- Verify `.env.local` has correct URL and keys
- Check Supabase project is active
- Test with simple query in browser console

### File uploads not working
- Check storage buckets are created and public
- Verify CORS is enabled in Supabase
- Check browser console for errors

### Real-time messages not updating
- Enable Realtime for messages table in Supabase
- Check subscription in browser DevTools Network tab
- Verify receiver_id filter in subscription

### Build errors
```bash
# Clear cache and reinstall
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## Performance Tips

1. **Images**: Use Next.js Image component
2. **Lists**: Implement pagination for large datasets
3. **Queries**: Select only needed fields from Supabase
4. **Components**: Use React.memo for expensive components
5. **Lazy Loading**: Use dynamic imports for code splitting

## Security Best Practices

1. Never commit `.env.local` (use `.env.local.example`)
2. Use Row Level Security (RLS) in Supabase
3. Validate all input with Zod schemas
4. Sanitize file uploads
5. Use HTTPS in production
6. Implement proper authentication

## Deployment to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with `npm run build && npm start`

## Next Steps

1. Add authentication with Supabase Auth
2. Implement video consulting
3. Add push notifications
4. Create admin dashboard
5. Add analytics

## Support

- Check [Next.js Docs](https://nextjs.org/docs)
- Check [Supabase Docs](https://supabase.com/docs)
- Review [Tailwind CSS](https://tailwindcss.com)

---

Happy coding! 🏥💻
