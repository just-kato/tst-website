# Supabase Database Setup for CRM System

This guide will help you set up the required database tables for the CRM functionality.

## Prerequisites

1. **Supabase Project**: You need an active Supabase project
2. **Environment Variables**: Ensure your `.env.local` has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Option 1: Apply Migrations via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**: Go to [supabase.com](https://supabase.com) and open your project
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Run Migrations in Order**:

   **Step 1: Run CRM Schema Migration**
   - Copy the contents of `supabase/migrations/001_crm_schema.sql`
   - Paste into SQL Editor and click "Run"
   
   **Step 2: Run Appointments Migration**
   - Copy the contents of `supabase/migrations/002_appointments_table.sql`
   - Paste into SQL Editor and click "Run"
   
   **Step 3: Run Notifications Migration**
   - Copy the contents of `supabase/migrations/003_notifications_table.sql`
   - Paste into SQL Editor and click "Run"

## Option 2: Apply via Supabase CLI (Local Development)

If you want to use the Supabase CLI for local development:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Initialize Supabase (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your_project_ref

# Apply migrations
supabase db push
```

## Verification

After running the migrations, you should have these tables:

### Core Tables
- `contacts` (extended with CRM columns)
- `appointments`
- `notifications`

### CRM Tables
- `crm_messages`
- `crm_message_templates`
- `crm_contact_segments`
- `crm_workflows`
- `crm_workflow_executions`

### Views
- `crm_contact_summary`
- `crm_message_stats`
- `upcoming_appointments`
- `appointment_summary`
- `unread_notifications`
- `notification_summary`

## Testing the Setup

1. **Check Tables**: In Supabase Dashboard > Table Editor, verify all tables exist
2. **Test GraphQL**: Try the `createContactWithAppointment` mutation
3. **Check Data**: Verify that creating a contact also creates proper records

## Row Level Security (RLS)

The migrations automatically enable RLS on all CRM tables with policies for authenticated users. This ensures:
- Only authenticated users can access CRM data
- Proper security for production use
- Compatible with Supabase auth system

## Default Data

The migrations include:
- **Default Contact Segments**: Prospects, Active Clients, Past Clients, etc.
- **Message Templates**: Welcome messages, appointment reminders, follow-ups
- **Proper Indexes**: For optimal query performance

## Next Steps

After applying migrations:
1. Test the GraphQL mutations work properly
2. Verify Twilio SMS integration (if configured)
3. Check dashboard notifications appear correctly
4. Test the calendar contact form end-to-end

## Troubleshooting

**Common Issues:**
- **Permission Errors**: Ensure you're using the service role key for migrations
- **Table Already Exists**: The migrations use `IF NOT EXISTS` - they're safe to re-run
- **Foreign Key Errors**: Make sure you have a `contacts` table with an `id` column

**Need Help?**
- Check Supabase logs in Dashboard > Settings > Logs
- Verify environment variables are correct
- Ensure your Supabase project is active and accessible