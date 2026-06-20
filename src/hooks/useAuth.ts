import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

export interface AuthState {
  user: User | null;
  session: unknown | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchUser = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error || !data) return null;
    return data as User;
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && mounted) {
        const user = await fetchUser(session.user.id);
        setState({
          user,
          session,
          isLoading: false,
          isAuthenticated: true,
        });
      } else if (mounted) {
        setState({ user: null, session: null, isLoading: false, isAuthenticated: false });
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        (async () => {
          const user = await fetchUser(session.user.id);
          setState({ user, session, isLoading: false, isAuthenticated: true });
        })();
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, session: null, isLoading: false, isAuthenticated: false });
      } else if (event === 'USER_UPDATED' && session?.user) {
        (async () => {
          const user = await fetchUser(session.user.id);
          setState((prev) => ({ ...prev, user }));
        })();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUser]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || '' },
      },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      const user = await fetchUser(data.user.id);
      setState({ user, session: data.session, isLoading: false, isAuthenticated: true });
    }
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setState({ user: null, session: null, isLoading: false, isAuthenticated: false });
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) return;
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', state.user.id);
    if (error) throw error;
    const user = await fetchUser(state.user.id);
    setState((prev) => ({ ...prev, user }));
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };
}
