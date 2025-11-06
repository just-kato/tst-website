# Supabase CLI Setup Guide

## Current Status
✅ **Supabase CLI**: Installed (v2.34.3)  
✅ **Project Initialized**: `supabase/config.toml` exists  
❌ **Docker**: Not running (required for local development)

## Option 1: Remote Development (Recommended for now)

Since Docker isn't running, let's use remote Supabase development:

### 1. Link to Remote Supabase Project

```bash
# Link to your existing Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# You can find your project ref in your Supabase dashboard URL:
# https://supabase.com/dashboard/project/YOUR_PROJECT_REF
```

### 2. Apply Migrations to Remote Database

```bash
# Push all migrations to remote database
supabase db push

# This will apply:
# - 001_crm_schema.sql (CRM tables and views)
# - 002_appointments_table.sql (Appointments functionality)  
# - 003_notifications_table.sql (Dashboard notifications)
```

### 3. Verify Migration Success

```bash
# Check migration status
supabase migration list

# Generate types from remote database
supabase gen types typescript --linked > src/types/supabase.ts
```

### 4. Test with Your Application

Your GraphQL mutations should now work with the real database!

## Option 2: Local Development (When Docker is Available)

If you want to set up local development later:

### 1. Install Docker Desktop

```bash
# Method 1: Download from docker.com/products/docker-desktop
# Method 2: Try homebrew again (may need sudo access)
brew install --cask docker
```

### 2. Start Docker and Run Local Supabase

```bash
# Start Docker Desktop first, then:
supabase start

# This will start local services on:
# - API: http://localhost:54321
# - Studio: http://localhost:54323
# - Database: postgresql://postgres:postgres@localhost:54322/postgres
```

### 3. Apply Migrations Locally

```bash
# Reset and apply all migrations
supabase db reset

# Or push changes
supabase db push
```

## Environment Configuration

### For Remote Development:
Keep your existing `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### For Local Development:
Create `.env.local.development`:
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
```

## Useful Commands

```bash
# Check project status
supabase status

# View database
supabase db inspect

# Open Studio (local or remote)
supabase studio

# Generate TypeScript types
supabase gen types typescript --linked

# Run specific migration
supabase migration up --file 001_crm_schema.sql

# Create new migration
supabase migration new your_migration_name
```

## Current Next Steps

1. **Get your Supabase project reference** from your dashboard
2. **Run `supabase link --project-ref YOUR_PROJECT_REF`**
3. **Apply migrations with `supabase db push`**
4. **Test your GraphQL mutations**

This approach lets you develop immediately while keeping the option to move to local development later when Docker is properly set up.