/**
 * EDIT ACTIVITY PAGE — /admin/activities/[id]
 *
 * Server component that fetches the activity by ID, plus supporting data.
 * Renders the shared ActivityForm in "edit" mode (activity prop provided).
 * RLS ensures a property_admin can only edit their own hotel's activities.
 */

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft } from "lucide-react";
import { ActivityForm } from "@/components/admin/activity-form";
import type { Profile, Activity, ActivityType, Hotel } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditActivityPage({ params }: PageProps) {
  const { id } = await params;
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

  // ── Fetch Activity + Supporting Data ─────────────────────────────────────
  const [
    { data: activity, error: activityError },
    { data: activityTypes },
    { data: hotels },
  ] = await Promise.all([
    supabase.from("activities").select("*").eq("id", id).single() as unknown as Promise<{
      data: Activity | null;
      error: unknown;
    }>,
    supabase.from("activity_types").select("*").order("name") as unknown as Promise<{
      data: ActivityType[] | null;
    }>,
    supabase.from("hotels").select("*").order("name") as unknown as Promise<{
      data: Hotel[] | null;
    }>,
  ]);

  // Activity not found or RLS blocked access → 404
  if (activityError || !activity) {
    notFound();
  }

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
          Edit Activity
        </h1>
        <p className="text-sm text-[#153E35] mt-1 font-sans truncate">
          {activity.title}
        </p>
      </div>

      {/* ── Form ────────────────────────────────────────────────── */}
      <ActivityForm
        activity={activity}
        activityTypes={activityTypes ?? []}
        hotels={hotels ?? []}
        defaultHotelId={activity.hotel_id}
        isMasterAdmin={profile.role === "master_admin"}
      />
    </div>
  );
}
