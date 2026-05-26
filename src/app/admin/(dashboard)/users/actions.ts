"use server";

/**
 * USERS SERVER ACTIONS
 *
 * Master-admin-only actions for managing admin accounts.
 *
 * We intentionally do NOT send invitation emails (Supabase built-in SMTP
 * is rate-limited to ~2/hr and custom SMTP is not configured). Instead,
 * `createUser` sets a temporary password the master admin shares manually
 * with the invitee, and flips profile.must_reset_password = true so the
 * user is forced through /admin/change-password on first login.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/types/database";

// ── Shared guard ──────────────────────────────────────────────────────────────
// Every action in this file must be gated on master_admin. RLS alone is
// insufficient because the admin client bypasses RLS.
async function requireMasterAdmin(): Promise<
  | { ok: true; userId: string }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: Pick<Profile, "role"> | null };

  if (profile?.role !== "master_admin") {
    return { ok: false, error: "Master admin access required." };
  }
  return { ok: true, userId: user.id };
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createUser(formData: FormData) {
  const guard = await requireMasterAdmin();
  if (!guard.ok) return { error: guard.error };

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const fullName = (formData.get("full_name") as string)?.trim() || null;
  const role = formData.get("role") as Profile["role"];
  const hotelIdRaw = (formData.get("hotel_id") as string)?.trim();
  const password = (formData.get("password") as string) ?? "";

  // ── Validation ──────────────────────────────────────────────────────────
  if (!email) return { error: "Email is required." };
  if (role !== "master_admin" && role !== "property_admin") {
    return { error: "Invalid role." };
  }
  if (password.length < 8) {
    return { error: "Temporary password must be at least 8 characters." };
  }
  // Master admins are not tied to a hotel; property admins must be.
  const hotel_id = role === "master_admin" ? null : hotelIdRaw || null;
  if (role === "property_admin" && !hotel_id) {
    return { error: "Property admins must be assigned to a hotel." };
  }

  const admin = createAdminClient();

  // ── Create auth user ────────────────────────────────────────────────────
  // email_confirm:true skips the email verification step since we're not
  // sending an email anyway — the master admin has vouched for the address.
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createErr || !created.user) {
    return { error: createErr?.message ?? "Could not create user." };
  }

  // ── Create profile row ──────────────────────────────────────────────────
  // If this insert fails we roll back the auth user so we don't leave
  // orphaned accounts that can log in but have no profile.
  const { error: profileErr } = await (
    admin.from("profiles") as unknown as {
      insert: (d: {
        id: string;
        role: Profile["role"];
        hotel_id: string | null;
        full_name: string | null;
        must_reset_password: boolean;
      }) => Promise<{ error: { message: string } | null }>;
    }
  ).insert({
    id: created.user.id,
    role,
    hotel_id,
    full_name: fullName,
    must_reset_password: true,
  });

  if (profileErr) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: `Profile creation failed: ${profileErr.message}` };
  }

  revalidatePath("/admin/users");
  return { success: true, email, password };
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

export async function updateUser(id: string, formData: FormData) {
  const guard = await requireMasterAdmin();
  if (!guard.ok) return { error: guard.error };

  const fullName = (formData.get("full_name") as string)?.trim() || null;
  const role = formData.get("role") as Profile["role"];
  const hotelIdRaw = (formData.get("hotel_id") as string)?.trim();

  if (role !== "master_admin" && role !== "property_admin") {
    return { error: "Invalid role." };
  }
  const hotel_id = role === "master_admin" ? null : hotelIdRaw || null;
  if (role === "property_admin" && !hotel_id) {
    return { error: "Property admins must be assigned to a hotel." };
  }

  const admin = createAdminClient();

  const { error } = await (
    admin.from("profiles") as unknown as {
      update: (d: Partial<Profile>) => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({ full_name: fullName, role, hotel_id })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deleteUser(id: string) {
  const guard = await requireMasterAdmin();
  if (!guard.ok) return { error: guard.error };

  // Prevent master admins from deleting themselves — would lock them out mid-session.
  if (guard.userId === id) {
    return { error: "You cannot delete your own account." };
  }

  const admin = createAdminClient();

  // Deleting from auth.users cascades to public.profiles via the FK constraint.
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}

// ── RESET TEMP PASSWORD ───────────────────────────────────────────────────────
// Lets the master admin issue a fresh temp password if an invitee lost theirs,
// and re-flips must_reset_password so they're forced to change it on next login.

export async function resetUserPassword(id: string, formData: FormData) {
  const guard = await requireMasterAdmin();
  if (!guard.ok) return { error: guard.error };

  const password = (formData.get("password") as string) ?? "";
  if (password.length < 8) {
    return { error: "Temporary password must be at least 8 characters." };
  }

  const admin = createAdminClient();

  const { error: pwErr } = await admin.auth.admin.updateUserById(id, { password });
  if (pwErr) return { error: pwErr.message };

  const { error: profileErr } = await (
    admin.from("profiles") as unknown as {
      update: (d: Partial<Profile>) => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .update({ must_reset_password: true })
    .eq("id", id);

  if (profileErr) return { error: profileErr.message };

  revalidatePath("/admin/users");
  return { success: true, password };
}
