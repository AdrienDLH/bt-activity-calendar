"use client";

/**
 * ACTIVITIES TABLE — Client Component
 *
 * Handles the interactive parts of the activities list:
 * - Client-side search/filter (no round-trip to server)
 * - Inline published toggle (calls togglePublished server action)
 * - Delete with confirmation
 *
 * The parent server component fetches data and passes it as props.
 */

import { useState, useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { Search, Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { togglePublished, deleteActivity } from "@/app/admin/(dashboard)/activities/actions";
import type { Activity, ActivityType } from "@/types/database";

// Join type for the query result (activity + its type name)
export type ActivityWithTypeName = Activity & {
  activity_types: Pick<ActivityType, "name"> | null;
};

interface ActivitiesTableProps {
  activities: ActivityWithTypeName[];
}

export function ActivitiesTable({ activities }: ActivitiesTableProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  // Track which row is currently toggling/deleting
  const [actionId, setActionId] = useState<string | null>(null);
  // confirmDeleteId tracks which row is showing inline delete confirm buttons.
  // Avoids window.confirm() which blocks browser events.
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // ── Client-side filter ─────────────────────────────────────────────────
  const filtered = activities.filter((a) =>
    [a.title, a.activity_types?.name, a.location, a.practitioner]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Toggle Published ───────────────────────────────────────────────────
  function handleToggle(id: string, current: boolean) {
    setActionId(id);
    startTransition(async () => {
      const result = await togglePublished(id, !current);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(current ? "Activity unpublished." : "Activity published.");
      }
      setActionId(null);
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────
  // Two-step: click trash → inline confirm row appears → click ✓ to delete.
  // Avoids window.confirm() which blocks all browser events.
  function handleDeleteConfirm(id: string) {
    setConfirmDeleteId(null);
    setActionId(id);
    startTransition(async () => {
      const result = await deleteActivity(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Activity deleted.");
      }
      setActionId(null);
    });
  }

  return (
    <div className="space-y-4">

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#153E35] pointer-events-none" />
          <Input
            type="search"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-none h-10 bg-card border-border text-[#153E35]"
          />
        </div>

        {/* New activity button */}
        <Button
          asChild
          className="bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-none shrink-0"
        >
          <Link href="/admin/activities/new">
            <Plus className="h-4 w-4" />
            New Activity
          </Link>
        </Button>
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="bg-card border border-border/50">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[#153E35]">
              {search ? `No activities match "${search}".` : "No activities yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans">
                    Title
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans hidden sm:table-cell">
                    Type
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans hidden lg:table-cell">
                    Time
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans">
                    Published
                  </th>
                  <th className="text-right p-4 text-xs uppercase tracking-wider text-[#153E35] font-normal font-sans">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((activity, i) => {
                  const isLoading = actionId === activity.id;
                  const isLast = i === filtered.length - 1;

                  return (
                    <tr
                      key={activity.id}
                      className={`
                        ${!isLast ? "border-b border-border/20" : ""}
                        ${isLoading ? "opacity-50" : ""}
                        hover:bg-background/40 transition-colors
                      `}
                    >
                      {/* Title */}
                      <td className="p-4">
                        <span className="font-medium text-[#153E35]">
                          {activity.title}
                        </span>
                        {/* Show type below title on mobile */}
                        {activity.activity_types?.name && (
                          <span className="block text-xs text-[#153E35] mt-0.5 sm:hidden">
                            {activity.activity_types.name}
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="p-4 text-[#153E35] hidden sm:table-cell">
                        {activity.activity_types?.name ?? "—"}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-[#153E35] hidden md:table-cell">
                        {format(new Date(activity.activity_date + "T00:00:00"), "dd MMM yyyy")}
                      </td>

                      {/* Start time */}
                      <td className="p-4 text-[#153E35] hidden lg:table-cell">
                        {activity.start_time
                          ? activity.start_time.slice(0, 5)
                          : "—"}
                      </td>

                      {/* Published toggle */}
                      <td className="p-4">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin text-luxury-gold" />
                        ) : (
                          <Switch
                            checked={activity.published}
                            onCheckedChange={() =>
                              handleToggle(activity.id, activity.published)
                            }
                            className="data-[state=checked]:bg-[#173F35]"
                            aria-label={`Toggle published for ${activity.title}`}
                          />
                        )}
                      </td>

                      {/* Edit + Delete actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit */}
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#153E35] hover:text-[#153E35]"
                          >
                            <Link href={`/admin/activities/${activity.id}`}>
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit {activity.title}</span>
                            </Link>
                          </Button>

                          {/* Delete — two-step inline confirm to avoid window.confirm() */}
                          {confirmDeleteId === activity.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-destructive mr-1 font-sans">Delete?</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteConfirm(activity.id)}
                                disabled={isPending}
                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span className="sr-only">Confirm delete {activity.title}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setConfirmDeleteId(null)}
                                className="h-7 w-7 text-[#153E35] hover:text-[#153E35]"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span className="sr-only">Cancel delete</span>
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setConfirmDeleteId(activity.id)}
                              disabled={isPending || actionId === activity.id}
                              className="h-8 w-8 text-[#153E35] hover:text-destructive"
                            >
                              {actionId === activity.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              <span className="sr-only">Delete {activity.title}</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Row count footer */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border/20 text-xs text-[#153E35] font-sans">
            {filtered.length === activities.length
              ? `${activities.length} activities`
              : `${filtered.length} of ${activities.length} activities`}
          </div>
        )}
      </div>
    </div>
  );
}
