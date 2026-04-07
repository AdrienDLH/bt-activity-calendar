/**
 * ACTIVITY TYPES PAGE — /admin/activity-types
 *
 * Master admin only.
 * Lists all activity types with an inline add form and delete buttons.
 *
 * Examples: Yoga, Meditation, Excursion, Spa, Cooking Class
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "lucide-react";
import { ActivityTypesManager } from "./activity-types-manager";
import type { Profile, ActivityType } from "@/types/database";

export default async function ActivityTypesPage() {
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
          <p className="font-reforma-gris text-lg text-[#153E35]">
            Access Denied
          </p>
          <p className="text-sm text-[#153E35]">
            Only master administrators can manage activity types.
          </p>
        </div>
      </div>
    );
  }

  // ── Fetch Types ───────────────────────────────────────────────────────────
  const { data: activityTypes } = await supabase
    .from("activity_types")
    .select("*")
    .order("name") as { data: ActivityType[] | null };

  return (
    <div className="space-y-6 max-w-2xl">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Tag className="h-4 w-4 text-luxury-gold" />
          <span className="text-xs uppercase tracking-wider text-[#153E35] font-sans">
            Master Admin
          </span>
        </div>
        <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
          Activity Types
        </h1>
        <p className="text-sm text-[#153E35] mt-1 font-sans">
          Categories used to classify activities across all hotels.
        </p>
      </div>

      {/* ── Interactive Manager ─────────────────────────────────── */}
      <ActivityTypesManager types={activityTypes ?? []} />
    </div>
  );
}
