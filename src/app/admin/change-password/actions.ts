"use server";

/**
 * CHANGE PASSWORD ACTION
 *
 * Called when a user invited by a master admin logs in with their
 * temporary password and is forced to pick a permanent one.
 *
 * Clears profile.must_reset_password after the update succeeds so the
 * user is no longer trapped in the change-password screen.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function changePassword(formData: FormData) {
  const password = (formData.get("password") as string) ?? "";
  const confirm = (formData.get("confirm") as string) ?? "";

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Update auth password
  const { error: pwErr } = await supabase.auth.updateUser({ password });
  if (pwErr) return { error: pwErr.message };

  // Clear the reset flag on the profile
  const { error: profileErr } = await (
    supabase.from("profiles") as unknown as {
      update: (d: Partial<Profile>) => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({ must_reset_password: false })
    .eq("id", user.id);

  if (profileErr) return { error: profileErr.message };

  redirect("/admin");
}
