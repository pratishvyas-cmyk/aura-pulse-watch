// ── Auth page (login + signup) ────────────────────────────────────────────────
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Zap, Mail, Lock, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "Confirm your address to activate your account." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 gradient-hero" />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-dim border border-primary/30 shadow-glow-teal">
            <Zap className="h-7 w-7 text-teal" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-foreground">ThePuck</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Display name"
                className="w-full rounded-xl border border-subtle bg-surface pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary/60 focus:ring-0"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-subtle bg-surface pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary/60"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              minLength={6}
              className="w-full rounded-xl border border-subtle bg-surface pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary/60"
            />
          </div>
          <PrimaryButton type="submit" loading={loading} className="w-full mt-2">
            {mode === "login" ? "Sign in" : "Create account"}
          </PrimaryButton>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {mode === "login" ? "New to ThePuck? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-teal hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
