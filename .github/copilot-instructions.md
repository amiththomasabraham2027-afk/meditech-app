# Meditech Development Guide

## Project Overview
Meditech is a production-ready telemedicine platform built with Next.js 15, TypeScript, Supabase, and Tailwind CSS. It supports both Patient and Doctor roles with real-time messaging, appointment scheduling, file management, and prescription handling.

## Architecture

### Technology Stack
- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Validation**: Zod
- **Image Processing**: Sharp

### Key Principles
- Modular component-based architecture
- Service layer for Supabase interactions
- Custom hooks for state management
- TypeScript for type safety
- Responsive design with Tailwind CSS

## File Organization

```
app/              → Next.js pages and routes
components/       → Reusable React components
services/         → Supabase service layer
hooks/            → Custom React hooks
models/           → TypeScript types and interfaces
utils/            → Utility functions and helpers
lib/              → External library configurations
styles/           → Global CSS files
public/           → Static assets
```

## Development Workflow

### Adding a New Feature

1. **Design the Component**: Create reusable component in `components/`
2. **Add Service Method**: Implement in appropriate `services/` file
3. **Add Hook if needed**: Create custom hook in `hooks/`
4. **Create Page**: Add route in `app/[role]/[feature]/`
5. **Add Types**: Update `models/types.ts` with new interfaces
6. **Add Validation**: Create Zod schema in `utils/validation.ts`

### Database Operations

All database operations go through service layer:
- `userService.ts` → User profile CRUD
- `appointmentService.ts` → Appointment management
- `messageService.ts` → Messaging with realtime
- `recordService.ts` → Medical records
- `prescriptionService.ts` → Prescriptions
- `doctorService.ts` → Doctor info
- `hospitalService.ts` → Hospital/department data

### Real-time Features

Use `useRealtimeSubscription` hook for real-time updates:
```typescript
const { isSubscribed, subscribe, unsubscribe } = useRealtimeSubscription(
  'table_name',
  userId,
  callback
);
```

### File Uploads

Use `FileUpload` component and `storageService` for file handling:
- Medical records → `medical-records` bucket
- Prescriptions → `prescriptions` bucket
- Logos → `logos` bucket

## Common Tasks

### Creating a New Page

1. Create folder in `app/[role]/[feature]/`
2. Add `page.tsx` with 'use client' directive
3. Import necessary components and services
4. Add authentication guard with `useAuth` hook
5. Add to sidebar navigation in `Sidebar.tsx`

### Adding a Service Method

```typescript
export const serviceService = {
  async methodName(params: Type): Promise<ReturnType> {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .method();
    
    if (error) throw error;
    return data;
  },
};
```

### Creating a Reusable Component

```typescript
'use client';

import React from 'react';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  return <div>{prop1}</div>;
}
```

## Environment Setup

### Required Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase public key
SUPABASE_SERVICE_ROLE_KEY      # Supabase service role
```

### Supabase Configuration
1. Create project at supabase.com
2. Create tables with provided SQL schema
3. Set up 3 Storage buckets (medical-records, prescriptions, logos)
4. Enable Realtime for messages table
5. Configure RLS policies for security

## Code Standards

### TypeScript  
- Always type function parameters and returns
- Use interfaces from `models/types.ts`
- Avoid `any` type

### React Components
- Use functional components
- Add 'use client' for client-side components
- Extract complex logic to hooks
- Use semantic HTML

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile`)
- Functions: camelCase (e.g., `fetchUserData`)
- Constants: UPPER_SNAKE_CASE
- Files: match export name (component.tsx, service.ts)

### Error Handling
- Use try-catch in async functions
- Provide user-friendly error messages
- Log errors for debugging
- Validate input with Zod

## Testing Workflow

### Manual Testing Checklist
- [ ] Role selection works (Patient/Doctor)
- [ ] Profile creation saves to Supabase
- [ ] Authentication persists on refresh
- [ ] CRUD operations work (Create, Read, Update, Delete)
- [ ] File uploads work with correct bucket
- [ ] Real-time messages appear instantly
- [ ] Responsive design on mobile/tablet
- [ ] Error messages display properly
- [ ] Loading states show during async operations
- [ ] Navigation routes correctly

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Push to GitHub, connect to Vercel
```

### Docker
```bash
docker build -t meditech .
docker run -p 3000:3000 meditech
```

## Troubleshooting

### Supabase Connection
- Verify `.env.local` credentials
- Check Supabase project is active
- Test connection with simple query

### Real-time Updates Not Working
- Ensure table has realtime enabled
- Check subscription is active
- Verify receiver_id filter matches current user

### File Upload Issues
- Check bucket exists and is public
- Verify file size < limit
- Check CORS in Supabase settings

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## Performance Optimization

- Use Next.js Image component for images
- Implement code splitting with dynamic imports
- Optimize database queries (select specific fields)
- Cache Supabase responses where appropriate
- Use React.memo for expensive components
- Implement pagination for large lists

## Security Best Practices

- Never commit `.env.local` (use `.env.local.example`)
- Validate all user input with Zod
- Use Supabase RLS for data access control
- Sanitize file uploads
- Use HTTPS in production
- Implement proper authentication checks

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Guides](https://supabase.com/docs/guides)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [React Patterns](https://react.dev)

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git commit -m "feat: describe feature"

# Push to remote
git push origin feature/feature-name

# Create pull request on GitHub
```

## Contact & Support

For questions or issues:
1. Check existing issues/discussions
2. Refer to documentation
3. Create new issue with details
4. Submit pull request with solution
