/**
 * WEEKLY TABLE VIEW COMPONENT
 *
 * Matrix layout: 7 day-columns × 4 time-of-day rows.
 * Each cell has a fixed height sized for 3 activities.
 * Activity cards show a square image on the left + title + time·type.
 *
 * KEY DESIGN NOTES:
 * - "Revel" (DB value) is displayed as "Glow" per frontend design spec
 * - Horizontally scrollable on mobile
 * - 4px gap between cells, 2px radius, #85754E borders
 * - All text styles mirror the List page
 */

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  parseISO,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Activity, ActivityType, TimeOfDay } from "@/types/database";

// ========================================
// TIME ROW CONFIGURATION
// ========================================
const TIME_ROWS: { value: TimeOfDay; displayLabel: string; timeRange: string }[] = [
  { value: "Rise",  displayLabel: "Rise",  timeRange: "6am – 9am" },
  { value: "Shine", displayLabel: "Shine", timeRange: "9am – 12pm" },
  { value: "Rest",  displayLabel: "Rest",  timeRange: "12pm – 5pm" },
  { value: "Revel", displayLabel: "Glow",  timeRange: "5pm onwards" },
];

interface WeeklyTableViewProps {
  activities: Activity[];
  activityTypesMap: Map<string, ActivityType>;
  onActivityClick: (activity: Activity) => void;
}

export function WeeklyTableView({
  activities,
  activityTypesMap,
  onActivityClick,
}: WeeklyTableViewProps) {
  const [weekStart, setWeekStart] = useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const activityMap = useMemo(() => {
    const map = new Map<string, Map<TimeOfDay, Activity[]>>();
    activities.forEach((activity) => {
      if (!activity.time_of_day) return;
      const dateKey = activity.activity_date;
      if (!map.has(dateKey)) map.set(dateKey, new Map());
      const dayMap = map.get(dateKey)!;
      if (!dayMap.has(activity.time_of_day)) dayMap.set(activity.time_of_day, []);
      dayMap.get(activity.time_of_day)!.push(activity);
    });
    return map;
  }, [activities]);

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const goToPrevWeek = () => setWeekStart((d) => subWeeks(d, 1));
  const goToNextWeek = () => setWeekStart((d) => addWeeks(d, 1));
  const goToCurrentWeek = () => setWeekStart(currentWeekStart);
  const handleDateJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setWeekStart(startOfWeek(parseISO(e.target.value), { weekStartsOn: 1 }));
  };

  const weekLabel = `${format(weekStart, "MMM d")} – ${format(addDays(weekStart, 6), "MMM d, yyyy")}`;
  const isCurrentWeek = weekStart.getTime() === currentWeekStart.getTime();
  const today = new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ========================================
          WEEK NAVIGATION BAR
          ======================================== */}
      <div className="flex items-center gap-3 mb-5">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevWeek}
          className="rounded-[2px] shrink-0 h-9 w-9 border-[#85754E]"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4 text-[#85754E]" />
        </Button>

        <AnimatePresence>
          {!isCurrentWeek && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={goToCurrentWeek}
              className={cn(
                "px-3 pt-[8px] pb-[8px] text-[11px] font-semibold uppercase tracking-[0.1em] leading-none rounded-[2px]",
                "border border-[#85754E] bg-background text-[#85754E]",
                "hover:bg-[#85754E] hover:text-white transition-colors duration-200 shrink-0"
              )}
            >
              Today
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-sm font-semibold text-[#153E35]">{weekLabel}</span>
          <div className="relative inline-flex items-center justify-center w-7 h-7">
            <input
              type="date"
              onChange={handleDateJump}
              aria-label="Jump to week containing date"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <CalendarDays className="h-4 w-4 text-[#85754E] pointer-events-none" />
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextWeek}
          className="rounded-[2px] shrink-0 h-9 w-9 border-[#85754E]"
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4 text-[#85754E]" />
        </Button>
      </div>

      {/* ========================================
          TABLE
          border-separate + borderSpacing: 4px gives gaps between cells.
          Each cell has rounded-[2px] and border border-[#85754E].
          ======================================== */}
      <div className="relative">
        {/* Fade gradient — indicates horizontal overflow on small screens */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-background to-transparent" />
        <div className="overflow-x-auto">
        <table
          className="w-full border-separate"
          style={{ borderSpacing: "4px 0" }}
        >
          {/* Column headers */}
          <thead>
            <tr>
              {/* Top-left spacer */}
              <th
                className="w-24 p-3 rounded-t-[2px] border border-[#85754E] bg-white sticky left-0 z-10"
                aria-hidden="true"
              />

              {days.map((day) => {
                const isToday = isSameDay(day, today);
                return (
                  <th
                    key={format(day, "yyyy-MM-dd")}
                    scope="col"
                    className={cn(
                      "p-3 text-center rounded-t-[2px] border border-[#85754E] min-w-[140px]",
                      isToday ? "bg-[#85754E]/10" : "bg-white"
                    )}
                  >
                    {/* Day abbreviation — chip style matching filter bar */}
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E]">
                      {format(day, "EEE")}
                    </div>
                    {/* Day number — Reforma Gris matching "Sunday" heading */}
                    <div className={cn(
                      "font-reforma-gris text-lg font-semibold leading-tight mt-1",
                      isToday ? "text-[#85754E]" : "text-[#153E35]"
                    )}>
                      {format(day, "d")}
                    </div>
                    {isToday && (
                      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E] mt-1">
                        Today
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* 4 time-of-day rows — fixed height accommodates 3 activities */}
          <tbody>
            {TIME_ROWS.map((row, rowIndex) => {
              const isLastRow = rowIndex === TIME_ROWS.length - 1;
              return (
              <tr key={row.value}>
                {/* Row header — no top border (shared with row above); bottom radius on last row only */}
                <th
                  scope="row"
                  className={cn(
                    "w-24 p-3 text-center align-top border border-t-0 border-[#85754E] bg-white sticky left-0 z-10",
                    isLastRow ? "rounded-b-[2px]" : ""
                  )}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#153E35]">
                    {row.displayLabel}
                  </div>
                  <div className="text-xs text-[#85754E] mt-1.5 leading-tight">
                    {row.timeRange}
                  </div>
                </th>

                {/* Activity cells — no top border; bottom radius on last row only */}
                {days.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const cellActivities = activityMap.get(dateKey)?.get(row.value) ?? [];
                  const isToday = isSameDay(day, today);

                  return (
                    <td
                      key={dateKey}
                      className={cn(
                        // Fixed height sized for 3 activity chips
                        "p-2 align-top border border-t-0 border-[#85754E]",
                        "h-[168px]",
                        isLastRow ? "rounded-b-[2px]" : "",
                        isToday ? "bg-[#85754E]/5" : "bg-white"
                      )}
                    >
                      <div className="flex flex-col gap-1.5 h-full overflow-hidden">
                        {cellActivities.slice(0, 3).map((activity) => (
                          <ActivityChip
                            key={activity.id}
                            activity={activity}
                            activityType={activityTypesMap.get(activity.type_id)}
                            onClick={() => onActivityClick(activity)}
                          />
                        ))}
                        {cellActivities.length > 3 && (
                          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E] pl-1">
                            +{cellActivities.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
              );
            })}
          </tbody>
        </table>
        </div>{/* end overflow-x-auto */}
      </div>{/* end relative wrapper */}

    </motion.div>
  );
}

// ========================================
// ACTIVITY CHIP
// No solid fill. Square image (2px radius) on left.
// Title (text-sm font-semibold) + time · type (text-xs) below.
// ========================================
function ActivityChip({
  activity,
  activityType,
  onClick,
}: {
  activity: Activity;
  activityType?: ActivityType;
  onClick: () => void;
}) {
  const startTime = activity.start_time ? activity.start_time.substring(0, 5) : null;
  const imageUrl = activity.image_urls?.[0] ?? null;
  const meta = [startTime, activityType?.name].filter(Boolean).join(" · ");

  return (
    <motion.button
      whileHover={{ backgroundColor: "rgba(133,117,78,0.07)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className="w-full text-left flex items-start gap-2 p-1 rounded-[2px] min-h-[44px] transition-colors duration-150"
    >
      {/* Square image — 40×40 with 2px radius */}
      <div className="w-10 h-10 shrink-0 rounded-[2px] overflow-hidden bg-[#DDC9A3]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={activity.title}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#DDC9A3]" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 py-0.5">
        <div className="text-sm font-semibold text-[#153E35] leading-tight line-clamp-2">
          {activity.title}
        </div>
        {meta && (
          <div className="text-xs text-[#85754E] mt-0.5 leading-none truncate">
            {meta}
          </div>
        )}
      </div>
    </motion.button>
  );
}
