# Database Setup Instructions

## Prerequisites

1. **Create a Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Configure Environment Variables**:
   - Copy `env.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
     ```

## Database Setup

### Option 1: Using Drizzle Push (Recommended for Development)
```bash
# Push schema directly to database
bun run db:push
```

### Option 2: Using Migrations (Recommended for Production)
```bash
# Generate migration files
bun run db:generate

# Apply migrations
bun run db:migrate
```

### Database Studio
```bash
# Open Drizzle Studio to view/edit data
bun run db:studio
```

## Schema Overview

### Tables Created:
- `users` - User accounts (links to Supabase auth.users)
- `user_profiles` - Extended user information
- `portfolio_items` - Tattooist portfolio images and details
- `availability_slots` - Tattooist available time slots
- `bookings` - Customer appointments and bookings

### Key Features:
- **User Types**: Customer and Tattooist roles
- **Portfolio Management**: Image uploads with metadata
- **Availability System**: Flexible time slot management
- **Booking System**: Complete booking workflow with payments
- **Type Safety**: Full TypeScript support with Zod validation

## Next Steps

1. Set up your Supabase project
2. Configure environment variables
3. Run database setup commands
4. Start implementing authentication (Task 1.3)

