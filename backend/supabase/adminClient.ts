import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/lib/supabase/types';

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function getAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.warn('[Supabase] Service role key not configured');
    return null;
  }

  adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
