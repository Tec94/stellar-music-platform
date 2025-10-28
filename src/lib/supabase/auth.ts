import type { Session, User } from '@supabase/supabase-js';
import { getBrowserClient } from './client';

interface AuthResult {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { username?: string; full_name?: string }
): Promise<AuthResult> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { user: null, session: null, error: new Error('Supabase client not configured') };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/verify`,
    },
  });

  return { user: data.user, session: data.session, error: error ? new Error(error.message) : null };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { user: null, session: null, error: new Error('Supabase client not configured') };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data.user, session: data.session, error: error ? new Error(error.message) : null };
}

export async function signInWithGoogle(): Promise<{ error: Error | null }> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { error: new Error('Supabase client not configured') };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: 'consent',
      },
    },
  });

  return { error: error ? new Error(error.message) : null };
}

export async function signOut(): Promise<{ error: Error | null }> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { error: new Error('Supabase client not configured') };
  }

  const { error } = await supabase.auth.signOut();
  return { error: error ? new Error(error.message) : null };
}

export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { error: new Error('Supabase client not configured') };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  });

  return { error: error ? new Error(error.message) : null };
}

export async function resendVerificationEmail(email: string): Promise<{ error: Error | null }> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { error: new Error('Supabase client not configured') };
  }

  const { error } = await supabase.auth.resend({ type: 'signup', email });
  return { error: error ? new Error(error.message) : null };
}

export async function updatePassword(newPassword: string): Promise<{ error: Error | null }> {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { error: new Error('Supabase client not configured') };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error ? new Error(error.message) : null };
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export function onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { unsubscribe: () => undefined };
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null, session ?? null);
  });

  return {
    unsubscribe: () => {
      data.subscription.unsubscribe();
    },
  };
}
