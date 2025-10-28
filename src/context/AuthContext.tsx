import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  getCurrentSession,
  getCurrentUser,
  onAuthStateChange,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
} from '@/lib/supabase/auth';
import { getProfile, upsertProfile } from '@/lib/supabase/database';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Awaited<ReturnType<typeof getProfile>>['data'];
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<Awaited<ReturnType<typeof getProfile>>['data']>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata?: { username?: string; full_name?: string }
  ) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>>['data']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await getProfile(userId);
    if (error) {
      setError(error.message);
      return null;
    }

    if (data) {
      setProfile(data);
      return data;
    }

    const generatedUsername = userId.slice(0, 8);
    const { data: createdProfile, error: upsertError } = await upsertProfile({
      id: userId,
      username: generatedUsername,
    });

    if (upsertError) {
      setError(upsertError.message);
      return null;
    }

    setProfile(createdProfile);
    return createdProfile;
  }, []);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    try {
      const [currentSession, currentUser] = await Promise.all([getCurrentSession(), getCurrentUser()]);
      setSession(currentSession);
      setUser(currentUser);

      if (currentUser) {
        await loadProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }, [loadProfile]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const subscription = onAuthStateChange(async (nextUser, nextSession) => {
      setUser(nextUser);
      setSession(nextSession);
      if (nextUser) {
        await loadProfile(nextUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const handleSignInWithEmail = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error.message);
      return result.error.message;
    }
    await bootstrap();
    return null;
  }, [bootstrap]);

  const handleSignUpWithEmail = useCallback(
    async (email: string, password: string, metadata?: { username?: string; full_name?: string }) => {
      const result = await signUpWithEmail(email, password, metadata);
      if (result.error) {
        setError(result.error.message);
        return result.error.message;
      }
      await bootstrap();
      return null;
    },
    [bootstrap]
  );

  const handleSignInWithGoogle = useCallback(async () => {
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error.message);
      return result.error.message;
    }
    return null;
  }, []);

  const handleSignOut = useCallback(async () => {
    const result = await signOut();
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const handleRefreshProfile = useCallback(async () => {
    if (user) {
      return await loadProfile(user.id);
    }
    return null;
  }, [user, loadProfile]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    profile,
    loading,
    error,
    refreshProfile: handleRefreshProfile,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
  }), [user, session, profile, loading, error, handleRefreshProfile, handleSignInWithEmail, handleSignUpWithEmail, handleSignInWithGoogle, handleSignOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
