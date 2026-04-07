/**
 * NEW ACTIVITY PAGE — /admin/activities/new
 *
 * Server component that fetches the data the form needs
 * (activity types + hotels for master_admin), then renders
 * the shared ActivityForm in "create" mode (no activity prop).
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft } from "lucide-react";
import { ActivityForm } from "@/components/admin/activity-form";
import type { Profile, ActivityType, Hotel } from "@/types/database";

export default async function NewActivityPage() {
  const supabase = await createClient();

  // ── Auth & Profile ────────────────────────────────────────────────────────
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  if (!profile) redirect("/admin/login");

  // ── Fetch Supporting Data ─────────────────────────────────────────────────
  const [{ data: activityTypes }, { data: hotels }] = await Promise.all([
    supabase.from("activity_types").select("*").order("name") as unknown as Promise<{
      data: ActivityType[] | null;
    }>,
    // Master admin sees all hotels; property_admin RLS restricts this
    supabase.from("hotels").select("*").order("name") as unknown as Promise<{
      data: Hotel[] | null;
    }>,
  ]);

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div>
        <Link
          href="/admin/activities"
          className="inline-flex items-center gap-1 text-xs text-[#153E35] hover:text-[#153E35] transition-colors no-underline mb-4"
        >
          <ChevronLeft className="h-3 w-3" />
          Back to Activities
        </Link>
        <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
          New Activity
        </h1>
      </div>

      {/* ── Form ────────────────────────────────────────────────── */}
      <ActivityForm
        activityTypes={activityTypes ?? []}
        hotels={hotels ?? []}
        defaultHotelId={
          // master_admin has null hotel_id — fall back to the only hotel when
          // there is exactly one, so the hidden hotel selector doesn't leave
          // hotel_id = "" and silently fail Zod validation.
          profile.hotel_id ?? (hotels?.length === 1 ? hotels[0].id : "")
        }
        isMasterAdmin={profile.role === "master_admin"}
      />
    </div>
  );
}
