import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { Profile } from "@/types";
import { supabase } from "@/lib/supabase";

// ── Auth rate limiter ─────────────────────────────────────────────────────────
// Max 5 failed attempts, then 15-minute lockout
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
let failedAttempts = 0;
let lockoutUntil = 0;

function checkRateLimit(): string | null {
  if (Date.now() < lockoutUntil) {
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 60000);
    return `Too many failed attempts. Try again in ${remaining} minute${remaining === 1 ? "" : "s"}.`;
  }
  return null;
}

function recordFailedAttempt() {
  failedAttempts += 1;
  if (failedAttempts >= MAX_ATTEMPTS) {
    lockoutUntil = Date.now() + LOCKOUT_MS;
    failedAttempts = 0;
  }
}

function resetAttempts() {
  failedAttempts = 0;
  lockoutUntil = 0;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  fetchProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  setProfile: (profile) => set({ profile }),

  setLoading: (isLoading) => set({ isLoading }),

  fetchProfile: async () => {
    const { user } = get();
    if (!user) {
      set({ profile: null });
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      set({ profile: data as Profile });
    }
  },

  signIn: async (email, password) => {
    const rateLimitError = checkRateLimit();
    if (rateLimitError) return { error: rateLimitError };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      recordFailedAttempt();
      return { error: error.message };
    }

    resetAttempts();

    set({ session: data.session, user: data.session?.user ?? null });

    // Fetch profile after login
    if (data.session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

      if (profile) {
        set({ profile: profile as Profile });
      }
    }

    return { error: null };
  },

  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: username,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.session) {
      set({ session: data.session, user: data.session.user });

      // Profile is auto-created by the database trigger
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

      if (profile) {
        set({ profile: profile as Profile });
      }
    }

    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },
}));
