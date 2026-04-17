import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app tree and provides a reactive Supabase session.
 *
 * Provided values:
 *   session  — the raw Supabase Session object (null when signed out)
 *   user     — session.user shorthand (null when signed out)
 *   loading  — true only during the initial session check on first mount;
 *              prevents any route guard from redirecting before auth state is known
 *   signOut  — async helper that calls supabase.auth.signOut()
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Retrieve any persisted session from localStorage immediately.
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });

    // 2. Subscribe to future auth state changes (sign-in, sign-out, token refresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // Once the listener fires at least once loading is already false, but
      // setting it again is safe and ensures consistency.
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — hook to consume AuthContext from any component in the tree.
 *
 * Usage:
 *   import { useAuth } from "@/contexts/AuthContext";
 *   const { session, user, loading, signOut } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
