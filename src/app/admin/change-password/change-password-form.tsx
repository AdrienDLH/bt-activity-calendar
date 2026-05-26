"use client";

/**
 * CHANGE PASSWORD FORM — Client Component
 *
 * Matches the brand/visual treatment of /admin/login so new users land
 * on a screen that clearly belongs to the same flow.
 */

import { useState, useTransition } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "./actions";

export function ChangePasswordForm({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await changePassword(formData);
      // On success, the server action redirects and this code never runs.
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-8">

        {/* ── BRAND HEADER ───────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <div className="w-12 h-1 bg-luxury-gold mx-auto mb-6" />
          <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
            Banyan Tree
          </h1>
          <p className="text-sm text-[#153E35] font-sans tracking-wide">
            Activity Calendar — Admin Portal
          </p>
        </div>

        {/* ── CARD ──────────────────────────────────────────────── */}
        <div className="bg-card border border-border/50 p-8 shadow-sm">
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <h2 className="font-reforma-gris text-lg text-[#153E35]">
                Set a new password
              </h2>
              <p className="text-sm text-[#153E35]">
                Your account uses a temporary password. Choose a permanent
                one to continue.
              </p>
              {email && (
                <p className="text-xs text-[#153E35]/70 pt-1 font-sans">
                  Signed in as <span className="font-medium">{email}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#153E35] text-xs uppercase tracking-wider">
                New password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="rounded-none h-11 bg-background border-border text-[#153E35] placeholder:text-[#153E35]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-[#153E35] text-xs uppercase tracking-wider">
                Confirm password
              </Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="rounded-none h-11 bg-background border-border text-[#153E35] placeholder:text-[#153E35]"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 border border-destructive/20">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-none"
            >
              {isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <><KeyRound className="h-4 w-4 mr-2" />Update password</>
              }
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[#153E35]">
          Banyan Tree Group · Activity Management System
        </p>
      </div>
    </main>
  );
}
