/**
 * LIST VIEW COMPONENT (week-view.tsx)
 *
 * Shows ALL activities grouped by date in chronological order.
 * Only dates that have activities are rendered — no empty day slots.
 * Used by the "List" tab in the calendar.
 *
 * CUSTOMIZATION:
 * - Day header styling (date circle, labels)
 * - Grid columns via grid-cols-1 md:grid-cols-2 lg:grid-cols-3
 * - Card spacing via gap-4
 */

"use client";

import { motion } from "framer-motion";
import { format, isSameDay, parseISO } from "date-fns";
import { Calendar } from "lucide-react";
import { ActivityCard } from "./activity-card";
import type { Activity, ActivityType } from "@/types/database";

interface WeekViewProps {
  /** Activities to display (pre-filtered from parent) */
  activities: Activity[];
  /** Map of activity type ID → ActivityType for display */
  activityTypesMap: Map<string, ActivityType>;
  /** Callback when an activity card is clicked */
  onActivityClick: (activity: Activity) => void;
}

/**
 * WeekView
 *
 * Renders all activities grouped by date, in chronological order.
 * Derives dates directly from the activities array — no fixed window.
 */
export function WeekView({
  activities,
  activityTypesMap,
  onActivityClick,
}: WeekViewProps) {
  // Derive unique dates from activities (activities arrive pre-sorted from server)
  const uniqueDates = [...new Set(activities.map((a) => a.activity_date))];

  // Group activities by date for O(1) lookup per section
  const activitiesByDate = new Map<string, Activity[]>();
  activities.forEach((activity) => {
    const key = activity.activity_date;
    if (!activitiesByDate.has(key)) activitiesByDate.set(key, []);
    activitiesByDate.get(key)!.push(activity);
  });

  // ========================================
  // EMPTY STATE
  // Shown when no activities match the current filters
  // ========================================
  if (uniqueDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Calendar className="h-12 w-12 text-[#153E35] mb-4" />
        <p className="text-[#153E35] text-lg font-medium">No activities found</p>
        <p className="text-[#153E35] text-sm mt-1">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {uniqueDates.map((dateKey, dayIndex) => {
        const day = parseISO(dateKey);
        const dayActivities = activitiesByDate.get(dateKey) || [];
        const isToday = isSameDay(day, new Date());

        return (
          <motion.section
            key={dateKey}
            // Staggered entrance — capped delay so long lists don't feel sluggish
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(dayIndex * 0.06, 0.4) }}
          >
            {/* ========================================
                DAY HEADER
                Date square on the left, full date on the right
                ======================================== */}
            <div className="flex items-center gap-3 mb-4">
              {/* Full date text + Today badge */}
              <div>
                <h3 className="text-lg font-semibold text-[#153E35]">
                  {format(day, "EEEE")}
                </h3>
                <p className="text-sm text-[#153E35]">
                  {format(day, "MMMM d, yyyy")}
                  {isToday && (
                    <span className="ml-2 px-2 pt-[4px] pb-[5px] rounded-[2px] bg-[#DDC9A3] text-[#85754E] text-[11px] font-semibold leading-none uppercase tracking-[0.1em]">
                      Today
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* ========================================
                ACTIVITIES GRID
                Responsive grid of activity cards
                ======================================== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {dayActivities.map((activity, activityIndex) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  activityType={activityTypesMap.get(activity.type_id)}
                  onClick={() => onActivityClick(activity)}
                  index={activityIndex}
                />
              ))}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
