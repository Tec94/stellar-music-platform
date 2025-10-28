# Integration Guide

This guide showcases how to consume the Supabase-based backend in the Adventure Quest Platform.

## Auth Helpers

All helpers live in `src/lib/supabase/auth.ts`.

```typescript
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  resetPassword,
  resendVerificationEmail,
  getCurrentUser,
  getCurrentSession,
} from '@/lib/supabase/auth';

// Sign up with metadata
await signUpWithEmail('user@example.com', 'SecurePass123', {
  username: 'adventurer',
  full_name: 'Lara Croft',
});

// Sign in with email/password
await signInWithEmail('user@example.com', 'SecurePass123');

// Launch Google OAuth
await signInWithGoogle();

// Sign out
await signOut();
```

## Database Helpers

Located in `src/lib/supabase/database.ts`.

```typescript
import {
  getProfile,
  upsertProfile,
  getTiers,
  getQuests,
  completeQuest,
  getChatMessages,
  sendChatMessage,
} from '@/lib/supabase/database';

// Fetch profile
const { data: profile } = await getProfile(userId);

// Update profile
const { data: updatedProfile } = await upsertProfile({
  id: userId,
  username: 'new-name',
  bio: 'Explorer',
});

// Fetch quests
const { data: quests } = await getQuests();

// Mark quest complete
await completeQuest(questId, userId, 'Had an amazing time!');

// Load chat history
const { data: messages } = await getChatMessages(roomId);

// Send chat message
await sendChatMessage(roomId, userId, 'Hello world!');
```

## Storage Helpers

Located in `src/lib/supabase/storage.ts`.

```typescript
import {
  uploadFile,
  getSignedUrl,
  deleteFile,
  generateAvatarPath,
  generateMediaPath,
} from '@/lib/supabase/storage';

const path = generateAvatarPath(userId, file.name);
const { url } = await uploadFile({
  bucket: 'avatars',
  path,
  file,
  upsert: true,
});

const { url: signedUrl } = await getSignedUrl({
  bucket: 'avatars',
  path,
  expiresIn: 3600,
});

await deleteFile('avatars', [path]);
```

## Real-time Helpers

`src/lib/supabase/realtime.ts` provides a convenient wrapper.

```typescript
import { subscribeToTable } from '@/lib/supabase/realtime';

const subscription = subscribeToTable('chat_messages', {
  filter: { room_id: roomId },
  event: 'INSERT',
  onPayload: (payload) => {
    console.log('New message', payload.new);
  },
  onStatusChange: (status) => {
    console.log('Realtime status', status);
  },
});

// Later
subscription.unsubscribe();
```

## Stripe Helpers

`src/lib/stripe/client.ts` handles client-side checkout.

```typescript
import { createSubscriptionCheckout } from '@/lib/stripe/client';

const { error } = await createSubscriptionCheckout({
  tierSlug: 'gold',
  billingPeriod: 'monthly',
  successUrl: `${window.location.origin}/tiers/success`,
  cancelUrl: `${window.location.origin}/tiers`,
});
```

Server-side webhook handler lives in `backend/stripe/webhook.ts` and updates Supabase records to reflect subscription status.

## Email Helpers

`backend/email/postmark.ts` contains helper functions:

```typescript
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendTierUpgradeEmail,
} from '../email/postmark';

await sendWelcomeEmail(user.email, user.username);
```

## Auth Context

Wrap your app with `AuthProvider` (`src/context/AuthContext.tsx`) for easy consumption.

```tsx
import { AuthProvider } from '@/context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
```

Consume via `useAuth()`:

```tsx
const { user, profile, signOut } = useAuth();
```

## Protected Routes

Use `<ProtectedRoute>` to guard routes.

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## Testing Tips

- Use `vi.mock('@/lib/supabase/client', () => ({ getBrowserClient: () => null }))` to mock in tests.
- Provide mocked responses for database functions when unit testing components.
- Use the Supabase CLI to run a local database for integration tests.
