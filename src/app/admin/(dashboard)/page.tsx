/**
 * ADMIN OVERVIEW PAGE — /admin
 *
 * Dashboard homepage showing key stats and recent activity.
 *
 * Stats shown (2×2 grid on desktop):
 * - Total Activities (this hotel or all hotels for master_admin)
 * - Published Activities
 * - Upcoming Activities (future dates)
 * - Activity Types count
 *
 * Also shows a "Recent Activities" table (last 10 by created_at).
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Tag,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile, Activity, ActivityType } from "@/types/database";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // ── Auth & Profile ──────────────────────────────────────────────────────
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single() as { data: Profile | null };

  if (!profile) redirect("/admin/login");

  // ── Stats Queries ────────────────────────────────────────────────────────
  // Build the base query — RLS auto-filters by hotel for property_admin
  const today = new Date().toISOString().split("T")[0];

  // Run all count queries in parallel for performance
  const [
    { count: totalActivities },
    { count: publishedActivities },
    { count: upcomingActivities },
    { count: activityTypesCount },
  ] = await Promise.all([
    supabase
      .from("activities")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .gte("activity_date", today),
    supabase
      .from("activity_types")
      .select("*", { count: "exact", head: true }),
  ]);

  // ── Recent Activities ─────────────────────────────────────────────────────
  const { data: recentActivities } = await supabase
    .from("activities")
    .select("*, activity_types(name)")
    .order("created_at", { ascending: false })
    .limit(10) as {
      data: (Activity & { activity_types: ActivityType | null })[] | null;
    };

  // ── Stat Cards Data ────────────────────────────────────────────────────────
  const stats = [
    {
      label: "Total Activities",
      value: totalActivities ?? 0,
      icon: CalendarDays,
      // Amber tint — warm neutral
      bg: "bg-luxury-gold/10",
      iconColor: "text-luxury-gold",
    },
    {
      label: "Published",
      value: publishedActivities ?? 0,
      icon: CheckCircle2,
      // Green tint — positive/active state
      bg: "bg-[#173F35]/10",
      iconColor: "text-[#173F35]",
    },
    {
      label: "Upcoming",
      value: upcomingActivities ?? 0,
      icon: Clock,
      // Subtle blue tint
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Activity Types",
      value: activityTypesCount ?? 0,
      icon: Tag,
      // Stone tint
      bg: "bg-background",
      iconColor: "text-[#153E35]",
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-luxury-gold" />
            <span className="text-xs uppercase tracking-wider text-[#153E35] font-sans">
              Dashboard
            </span>
          </div>
          <h1 className="font-reforma-negra text-2xl uppercase tracking-[0.15em] text-[#153E35]">
            Overview
          </h1>
        </div>

        {/* Quick action — most common task */}
        <Button asChild className="bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-none shrink-0">
          <Link href="/admin/activities/new">
            <Plus className="h-4 w-4" />
            New Activity
          </Link>
        </Button>
      </div>

      {/* ── Stats Grid (2×2) ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card border border-border/50 p-5 space-y-3"
            >
              {/* Icon badge */}
              <div className={`w-9 h-9 ${stat.bg} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>

              {/* Count — large, prominent */}
              <div>
                <p className="text-3xl font-reforma-negra text-[#153E35]">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-[#153E35] mt-0.5 font-sans uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Recent Activities Table ───────────────────────────────── */}
      <div className="bg-card border border-border/50">
        {/* Section header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <h2 className="font-reforma-gris text-base text-[#153E35]">
            Recent Activities
          </h2>
          <Button asChild variant="ghost" size="sm" className="text-xs text-[#153E35]">
            <Link href="/admin/activities">View all</Link>
          </Button>
        </div>

        {/* Table — responsive scroll on mobile */}
        <div className="overflow-x-auto">
          {!recentActivities?.length ? (
            <div className="p-10 text-center">
              <CalendarDays className="h-8 w-8 text-[#153E35] mx-auto mb-3" />
              <p className="text-sm text-[#153E35]">No activities yet.</p>
              <Button asChild size="sm" className="mt-4 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-none">
                <Link href="/admin/activities/new">Create your first activity</Link>
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-sans font-normal">
                    Title
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-sans font-normal hidden sm:table-cell">
                    Type
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-sans font-normal hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-sans font-normal">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity, i) => (
                  <tr
                    key={activity.id}
                    className={`border-b border-border/20 hover:bg-background/50 transition-colors ${
                      i === recentActivities.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {/* Title — links to edit page */}
                    <td className="p-4">
                      <Link
                        href={`/admin/activities/${activity.id}`}
                        className="font-medium text-[#153E35] hover:text-luxury-gold transition-colors no-underline"
                      >
                        {activity.title}
                      </Link>
                    </td>

                    {/* Activity type name */}
                    <td className="p-4 text-[#153E35] hidden sm:table-cell">
                      {activity.activity_types?.name ?? "—"}
                    </td>

                    {/* Formatted date */}
                    <td className="p-4 text-[#153E35] hidden md:table-cell">
                      {format(new Date(activity.activity_date + "T00:00:00"), "dd MMM yyyy")}
                    </td>

                    {/* Published badge */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-sans uppercase tracking-wide ${
                          activity.published
                            ? "bg-[#173F35]/10 text-[#173F35]"
                            : "bg-[#153E35]/8 text-[#153E35]"
                        }`}
                      >
                        {activity.published ? "Live" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
