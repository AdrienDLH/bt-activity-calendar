/**
 * ACTIVITIES LIST PAGE — /admin/activities
 *
 * Server component that fetches all activities for the logged-in user's hotel.
 * RLS in Supabase automatically scopes results — property_admin sees only
 * their hotel's activities; master_admin sees all.
 *
 * Renders the ActivitiesTable client component for interactivity.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CalendarDays } from "lucide-react";
import { ActivitiesTable, type ActivityWithTypeName } from "@/components/admin/activities-table";
import type { Profile } from "@/types/database";

export default async function ActivitiesPage() {
  const supabase = await createClient();

  // ── Auth ─────────────────────────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  if (!profile) redirect("/admin/login");

  // ── Fetch Activities ──────────────────────────────────────────────────────
  // Join with activity_types to get the type name.
  // RLS handles hotel scoping automatically.
  const { data: activities } = await supabase
    .from("activities")
    .select("*, activity_types(name)")
    .order("activity_date", { ascending: false })
    .order("start_time", { ascending: true }) as {
      data: ActivityWithTypeName[] | null;
    };

  return (
    <div className="space-y-6">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="h-4 w-4 text-luxury-gold" />
          <span className="text-xs uppercase tracking-wider text-[#153E35] font-sans">
            Management
          </span>
        </div>
        <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
          Activities
        </h1>
        <p className="text-sm text-[#153E35] mt-1 font-sans">
          {activities?.length ?? 0} total activities
        </p>
      </div>

      {/* ── Interactive Table (client component) ─────────────────── */}
      <ActivitiesTable activities={activities ?? []} />
    </div>
  );
}
