// ── useAuth — session management + profile loading ────────────────────────────
import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store";
import type { PreAuthProfile } from "@/store";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setProfile, preAuthProfile, setPreAuthDone } = useUserStore();

  async function applyPreAuthProfile(userId: string, pre: PreAuthProfile) {
    await supabase.from("profiles").update({
      display_name: pre.display_name,
      age: pre.age,
      units: pre.units,
      onboarding_done: true,
    }).eq("user_id", userId);
    // Clear the pre-auth state so it doesn't re-apply on next login
    setPreAuthDone(false);
  }

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer Supabase query to avoid deadlock
          setTimeout(async () => {
            const { data } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", session.user.id)
              .single();
            if (data) {
              // If pre-auth profile data exists, merge it into the DB
              const pre = useUserStore.getState().preAuthProfile;
              const preDone = useUserStore.getState().preAuthDone;
              if (pre && preDone) {
                await applyPreAuthProfile(session.user.id, pre);
                const { data: updated } = await supabase
                  .from("profiles")
                  .select("*")
                  .eq("user_id", session.user.id)
                  .single();
                if (updated) setProfile(updated);
              } else {
                setProfile(data);
              }
            }
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setProfile]);

  const signOut = () => supabase.auth.signOut();

  return { user, session, loading, signOut };
}
