# Supabase Backend Integration

This document describes how to set up and operate the Supabase-backed Adventure Quest Platform.

## Prerequisites

- Node.js 18+
- Supabase account
- Stripe account (test mode acceptable)
- Postmark account (server token)
- Supabase CLI (`npm install -g supabase`)

## Environment Variables

Copy `.env.example` to `.env` and populate:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
POSTMARK_SERVER_TOKEN=...
POSTMARK_FROM_EMAIL=noreply@example.com
VITE_APP_URL=http://localhost:5173
```

## Running Migrations

1. Authenticate the CLI:
   ```bash
   supabase login
   ```
2. Link to your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
3. Push the schema:
   ```bash
   supabase db push
   ```

## Storage Buckets

Create the following buckets in the Supabase dashboard (Storage → Create bucket):

| Bucket   | Visibility | Max Size | Allowed Types                              |
|----------|------------|----------|--------------------------------------------|
| avatars  | Private    | 10 MB    | image/png, image/jpeg, image/webp          |
| media    | Private    | 500 MB   | image/png, image/jpeg, image/webp, video/* |
| products | Private    | 50 MB    | image/png, image/jpeg, image/webp          |

Apply the RLS policies from `supabase/migrations/202410280000_initial.sql` to the `storage.objects` table if you want fine-grained access control.

## Authentication Configuration

- Enable email/password sign-in (Supabase Dashboard → Authentication → Providers)
- Optionally enable Google OAuth and set redirect URL to `https://<project>.supabase.co/auth/v1/callback`
- List `http://localhost:5173` and your production URL in the redirect URLs list

## Stripe Setup

1. Create a webhook endpoint pointing to `/api/webhooks/stripe`
2. Subscribe to the events listed in `backend/stripe/webhook.ts`
3. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`
4. Use the test publishable and secret keys while developing

## Postmark Setup

- Create a server
- Add and verify a sender signature (e.g., `noreply@yourdomain.com`)
- Copy the server token to `POSTMARK_SERVER_TOKEN`

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

The app will start at `http://localhost:5173`.

## Additional Documentation

- [`schema.md`](./schema.md) details the database structure and RLS policies
- [`integration.md`](./integration.md) showcases code samples and integration notes

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Supabase client not configured` | Ensure `.env` variables are loaded and restart dev server |
| 401/403 responses | Check RLS policies and ensure the user has the right tier/role |
| Storage uploads blocked | Verify bucket MIME type and size limits |
| Stripe webhook failing | Check the signing secret and inspect the event payload |
| Postmark email not sent | Verify sender signature and token |

For additional help consult:
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Postmark Docs](https://postmarkapp.com/developer)
