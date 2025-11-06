# GraphQL Hooks Implementation Guide

## Current Status
- ✅ GraphQL queries and mutations organized
- ✅ Database security implemented  
- ❌ React hooks not implemented (using direct client calls)

## To Implement useQuery and useMutation Hooks

### Step 1: Fix Apollo Client Setup

The current implementation uses direct `apolloClient.mutate()` calls instead of React hooks due to compatibility issues with Next.js 15.

```typescript
// Current working approach (direct client):
const { data } = await apolloClient.mutate({
  mutation: CREATE_CONTACT_WITH_APPOINTMENT,
  variables: input
});

// Target approach (React hooks):
const [createContact, { loading, error }] = useMutation(CREATE_CONTACT_WITH_APPOINTMENT);
const result = await createContact({ variables: input });
```

### Step 2: Update Apollo Provider

Replace the current Apollo setup with standard React hooks:

```typescript
// In src/lib/apollo/client.tsx
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Remove experimental Next.js package
// Add standard Apollo Provider
```

### Step 3: Create Custom Hooks

```typescript
// src/lib/graphql/hooks/useAppointmentBooking.ts
import { useMutation } from '@apollo/client';
import { CREATE_CONTACT_WITH_APPOINTMENT } from '../mutations';

export const useAppointmentBooking = () => {
  const [createContactWithAppointment, { loading, error }] = useMutation(
    CREATE_CONTACT_WITH_APPOINTMENT,
    {
      refetchQueries: ['GetUpcomingAppointments', 'GetDashboardData']
    }
  );

  const bookAppointment = async (input) => {
    const result = await createContactWithAppointment({
      variables: { input }
    });
    return result.data?.createContactWithAppointment;
  };

  return { bookAppointment, loading, error };
};
```

### Step 4: Update Component Usage

```typescript
// In CalendarContactForm.tsx
import { useAppointmentBooking } from '@/lib/graphql/hooks';

const CalendarContactForm = () => {
  const { bookAppointment, loading, error } = useAppointmentBooking();

  const handleSchedule = async (dateTime) => {
    try {
      const result = await bookAppointment({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        scheduledAt: dateTime.toISOString(),
        timeZone: formData.timezone,
      });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form>
      <button disabled={loading}>
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
};
```

## Why This Wasn't Implemented Initially

1. **Compatibility Issues**: Next.js 15 + experimental Apollo packages had import conflicts
2. **Build Priority**: Focused on getting security and organization working first
3. **Framework Stability**: Direct client usage is more stable in this setup

## Benefits of Implementing Hooks

1. **Better Developer Experience**: Automatic loading states and error handling
2. **React Patterns**: More idiomatic React code
3. **Cache Management**: Automatic query invalidation and updates
4. **Type Safety**: Better TypeScript integration

## Recommendation

Implement hooks as a separate phase after confirming the current security and organization improvements are working in production.