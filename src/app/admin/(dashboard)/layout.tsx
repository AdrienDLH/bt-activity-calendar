/**
 * ADMIN DASHBOARD LAYOUT — (dashboard) route group
 *
 * This layout wraps all protected admin pages.
 * It is placed in a route group (dashboard) so the /admin/login page
 * is NOT wrapped by this layout — login has its own standalone design.
 *
 * Responsibilities:
 * 1. Verify the user has an active session (redirect to /login if not)
 * 2. Fetch the user's profile (role + hotel assignment)
 * 3. Fetch the hotel if the user is a property_admin
 * 4. Render the Sidebar + main content area
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/sidebar";
import type { Profile, Hotel } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // ── Session Check ────────────────────────────────────────────────────────
  // Use getSession() to avoid the GoTrue race condition where getUser()
  // returns "session not found" milliseconds after login because the session
  // hasn't been committed to auth.sessions yet.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  if (!user) {
    redirect("/admin/login");
  }

  // ── Profile Fetch ────────────────────────────────────────────────────────
  // RLS policies ensure each user can only read their own profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // User exists in auth but has no profile row — redirect to login
    redirect("/admin/login");
  }

  // ── Hotel Fetch ──────────────────────────────────────────────────────────
  // Only fetch a hotel if this user is assigned to one (property_admin)
  // Master admins have hotel_id = null and see all hotels
  let hotel: Hotel | null = null;

  if (profile.hotel_id) {
    const { data } = await supabase
      .from("hotels")
      .select("*")
      .eq("id", profile.hotel_id)
      .single() as { data: Hotel | null };
    hotel = data;
  }

  return (
    // ── Layout Shell ────────────────────────────────────────────────────────
    // Desktop: sidebar (fixed, 256px) + scrollable main content
    // Mobile: full-width content + fixed bottom nav (sidebar handles both)
    <div className="min-h-screen bg-background">
      {/* Sidebar component handles both desktop + mobile nav internally */}
      <Sidebar profile={profile} hotel={hotel} />

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      {/* md:ml-64 offsets the content to the right of the fixed sidebar */}
      <main className="md:ml-64 min-h-screen">
        {/* Inner padding — generous whitespace per Apple HIG */}
        <div className="p-6 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
