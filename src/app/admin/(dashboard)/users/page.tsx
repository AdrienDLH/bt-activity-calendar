/**
 * USERS PAGE — /admin/users
 *
 * Master admin only. Full CRUD over admin accounts:
 *   - Add a user with a temporary password
 *   - Edit role / hotel / full name
 *   - Reset a user's temporary password
 *   - Delete a user
 *
 * Emails (auth addresses) are stored in auth.users and are not visible
 * through an RLS-gated select on public.profiles — so we use the admin
 * client here to join them in.
 */

import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UsersManager, type UserRow } from "./users-manager";
import type { Profile, Hotel } from "@/types/database";

// Row shape returned by the profile+hotel join before we splice emails in.
type ProfileWithHotel = Profile & {
  hotels: Pick<Hotel, "name"> | null;
};

export default async function UsersPage() {
  const supabase = await createClient();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  if (!profile) redirect("/admin/login");

  // ── Guard: master_admin only ──────────────────────────────────────────────
  if (profile.role !== "master_admin") {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-2">
          <p className="font-reforma-gris text-lg text-[#153E35]">Access Denied</p>
          <p className="text-sm text-[#153E35]">
            Only master administrators can manage users.
          </p>
        </div>
      </div>
    );
  }

  // ── Fetch Profiles + Hotels + Emails ──────────────────────────────────────
  // Profiles + joined hotel name come from RLS-safe query.
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*, hotels(name)")
    .order("updated_at", { ascending: false }) as {
      data: ProfileWithHotel[] | null;
    };

  // Hotels list for the role/hotel selector in the manager UI.
  const { data: hotels } = await supabase
    .from("hotels")
    .select("*")
    .order("name") as { data: Hotel[] | null };

  // Admin client — needed to read auth.users.email, which RLS never exposes.
  // Catch missing-service-role early so the page fails loudly instead of
  // silently rendering every row with "—" for email.
  let users: UserRow[] = [];
  let adminError: string | null = null;

  try {
    const admin = createAdminClient();
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const emailById = new Map<string, string | null>(
      (list?.users ?? []).map((u) => [u.id, u.email ?? null])
    );

    users = (profiles ?? []).map((p) => ({
      ...p,
      email: emailById.get(p.id) ?? null,
    }));
  } catch (err) {
    adminError = err instanceof Error ? err.message : "Admin client unavailable.";
  }

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-luxury-gold" />
          <span className="text-xs uppercase tracking-wider text-[#153E35] font-sans">
            Master Admin
          </span>
        </div>
        <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
          Users
        </h1>
        <p className="text-sm text-[#153E35] mt-1 font-sans">
          {users.length} admin {users.length === 1 ? "account" : "accounts"}
        </p>
      </div>

      {/* ── Setup warning ───────────────────────────────────────── */}
      {/* Shown when SUPABASE_SERVICE_ROLE_KEY isn't configured — without it
          we can't invite, delete, or read emails. */}
      {adminError && (
        <div className="bg-destructive/10 border border-destructive/20 p-4">
          <p className="text-xs uppercase tracking-wider text-destructive font-sans">
            Setup required
          </p>
          <p className="text-sm text-[#153E35] mt-1">
            {adminError}
          </p>
          <p className="text-xs text-[#153E35]/80 mt-2 font-sans">
            Add the key to <code className="bg-background px-1">.env.local</code> and
            restart the dev server.
          </p>
        </div>
      )}

      {/* ── Manager ────────────────────────────────────────────── */}
      {!adminError && (
        <UsersManager
          users={users}
          hotels={hotels ?? []}
          currentUserId={user.id}
        />
      )}
    </div>
  );
}
