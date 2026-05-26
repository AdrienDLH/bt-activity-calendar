/**
 * CHANGE PASSWORD PAGE — /admin/change-password
 *
 * Displayed to newly-invited users on first login. The dashboard layout
 * redirects here when profile.must_reset_password is true, so a user with
 * a temporary password cannot reach any admin screen until they pick a
 * permanent one.
 *
 * This page lives OUTSIDE the (dashboard) route group so it does not
 * inherit the dashboard layout (sidebar, etc.) — it's a focused,
 * login-style screen.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChangePasswordForm } from "./change-password-form";
import type { Profile } from "@/types/database";

export default async function ChangePasswordPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) redirect("/admin/login");

  // If the user landed here but doesn't actually need to reset, bounce to dashboard.
  const { data: profile } = await supabase
    .from("profiles")
    .select("must_reset_password")
    .eq("id", user.id)
    .single() as { data: Pick<Profile, "must_reset_password"> | null };

  if (!profile?.must_reset_password) redirect("/admin");

  return <ChangePasswordForm email={user.email ?? ""} />;
}
