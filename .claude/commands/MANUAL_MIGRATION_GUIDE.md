# Manual Migration Application Guide

If you want to apply migrations immediately while setting up CLI access, you can run the SQL manually:

## Steps:

### 1. Open Supabase SQL Editor
- Go to: https://supabase.com/dashboard/project/pvbdrbaquwivhylsmagn
- Click "SQL Editor" in the left sidebar

### 2. Apply Migration 1: CRM Schema
- Copy the contents of `supabase/migrations/001_crm_schema.sql`
- Paste into SQL Editor
- Click "Run" button
- Wait for completion (may take 30-60 seconds)

### 3. Apply Migration 2: Appointments
- Copy the contents of `supabase/migrations/002_appointments_table.sql` 
- Paste into SQL Editor
- Click "Run" button

### 4. Apply Migration 3: Notifications
- Copy the contents of `supabase/migrations/003_notifications_table.sql`
- Paste into SQL Editor  
- Click "Run" button

### 5. Verify Tables Created
- Go to "Table Editor" in dashboard
- You should see all these tables:
  - contacts (with new CRM columns)
  - crm_messages
  - crm_message_templates  
  - crm_contact_segments
  - crm_workflows
  - crm_workflow_executions
  - appointments
  - notifications

## Test Your Application

After applying the migrations manually:

1. **Restart your server**:
   ```bash
   # Kill current server
   pkill -f "npm run start"
   
   # Clean restart
   rm -rf .next
   npm run build
   npm run start
   ```

2. **Test GraphQL mutation**:
   ```bash
   curl -X POST http://localhost:3000/api/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "mutation { createContactWithAppointment(input: { name: \"Test User\", email: \"test@example.com\", phoneNumber: \"+1234567890\", scheduledAt: \"2024-01-01T10:00:00Z\", timeZone: \"America/New_York\" }) { contact { id name email } smsTriggered messages } }"
     }'
   ```

If this returns actual data instead of errors, your migrations worked! 🎉

## Parallel CLI Setup

While testing manually, you can still get the CLI working:
1. Get database password from Settings > Database
2. Run: `supabase link --project-ref pvbdrbaquwivhylsmagn --password 'your-password'`
3. Future migrations will be easier: `supabase db push`