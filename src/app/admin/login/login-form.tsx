"use client";

/**
 * LOGIN FORM — Client Component
 *
 * Two modes:
 *  1. Magic link — sends OTP email (production default)
 *  2. Password  — native HTML form POST to /api/auth/login
 *
 * routeError is passed in from the Server Component parent and shows
 * the error returned by the login API route on a failed password attempt.
 */

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, Loader2, KeyRound } from "lucide-react";

type LoginMode = "magic" | "password";

export function LoginForm({ routeError }: { routeError: string | null }) {
  // If the server returned a login error (e.g. wrong password), default to
  // password mode so the error message is visible and the user doesn't have
  // to toggle back to the password form manually.
  const [mode, setMode] = useState<LoginMode>(routeError ? "password" : "magic");
  const [email, setEmail] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [magicError, setMagicError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleMagicSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMagicLoading(true);
    setMagicError(null);

    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/admin/auth/callback` },
    });

    if (error) setMagicError(error.message);
    else setSent(true);

    setMagicLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-8">

        {/* ── BRAND HEADER ─────────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <div className="w-12 h-1 bg-luxury-gold mx-auto mb-6" />
          <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
            Banyan Tree
          </h1>
          <p className="text-sm text-[#153E35] font-sans tracking-wide">
            Activity Calendar — Admin Portal
          </p>
        </div>

        {/* ── LOGIN CARD ────────────────────────────────────────────── */}
        <div className="bg-card border border-border/50 p-8 shadow-sm">

          {sent ? (
            // ── SUCCESS STATE ─────────────────────────────────────────
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-luxury-gold/15 flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-luxury-gold" />
              </div>
              <div className="space-y-1">
                <h2 className="font-reforma-gris text-lg text-[#153E35]">Check your inbox</h2>
                <p className="text-sm text-[#153E35]">
                  We sent a magic link to{" "}
                  <span className="font-medium text-[#153E35]">{email}</span>.
                  Click it to sign in.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-[#153E35] hover:text-[#153E35]"
              >
                Use a different email
              </Button>
            </div>

          ) : mode === "magic" ? (
            // ── MAGIC LINK FORM ───────────────────────────────────────
            <form onSubmit={handleMagicSubmit} className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-reforma-gris text-lg text-[#153E35]">Sign in</h2>
                <p className="text-sm text-[#153E35]">Enter your email to receive a magic link.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#153E35] text-xs uppercase tracking-wider">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@banyantree.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="rounded-none h-11 bg-background border-border text-[#153E35] placeholder:text-[#153E35]"
                />
              </div>

              {magicError && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 border border-destructive/20">
                  {magicError}
                </p>
              )}

              <Button
                type="submit"
                disabled={magicLoading || !email}
                className="w-full h-11 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-none"
              >
                {magicLoading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Mail className="h-4 w-4 mr-2" />Send Magic Link</>
                }
              </Button>

              <button
                type="button"
                onClick={() => setMode("password")}
                className="w-full text-center text-xs text-[#153E35] hover:text-[#153E35] transition-colors"
              >
                Sign in with password instead
              </button>
            </form>

          ) : (
            // ── PASSWORD FORM ─────────────────────────────────────────
            // Native HTML POST to /api/auth/login — the server sets session
            // cookies on the redirect response so the browser stores them
            // before navigating to /admin.
            <form method="POST" action="/api/auth/login" className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-reforma-gris text-lg text-[#153E35]">Sign in</h2>
                <p className="text-sm text-[#153E35]">Enter your email and password.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pw-email" className="text-[#153E35] text-xs uppercase tracking-wider">
                  Email address
                </Label>
                <Input
                  id="pw-email"
                  name="email"
                  type="email"
                  placeholder="you@banyantree.com"
                  required
                  autoComplete="email"
                  className="rounded-none h-11 bg-background border-border text-[#153E35] placeholder:text-[#153E35]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#153E35] text-xs uppercase tracking-wider">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="rounded-none h-11 bg-background border-border text-[#153E35] placeholder:text-[#153E35]"
                />
              </div>

              {routeError && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 border border-destructive/20">
                  {routeError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-none"
              >
                <KeyRound className="h-4 w-4 mr-2" />Sign In
              </Button>

              <button
                type="button"
                onClick={() => setMode("magic")}
                className="w-full text-center text-xs text-[#153E35] hover:text-[#153E35] transition-colors"
              >
                Sign in with magic link instead
              </button>
            </form>
          )}
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <p className="text-center text-xs text-[#153E35]">
          Banyan Tree Group · Activity Management System
        </p>
      </div>
    </main>
  );
}
