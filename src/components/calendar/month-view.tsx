/**
 * MONTH VIEW COMPONENT
 *
 * Monthly calendar grid — styled to match the Weekly table view:
 * - 4px gaps between cells, rounded-[2px], #85754E borders
 * - Nav buttons mirror the weekly nav (outline, same chip "Today" button)
 * - Mon-first week (matches Weekly)
 * - Today cell: bg-[#85754E]/10, today number: bg-[#85754E] text-white
 * - Activity chips: bg-[#173F35]/10 with hover, 2px radius
 * - "+N more" and day-number click expands the day detail section below
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "./activity-card";
import { cn } from "@/lib/utils";
import type { Activity, ActivityType } from "@/types/database";

/** Maximum activity titles shown inline before "+N more" overflow */
const CELL_LIMIT = 4;

interface MonthViewProps {
  activities: Activity[];
  activityTypesMap: Map<string, ActivityType>;
  onActivityClick: (activity: Activity) => void;
}

export function MonthView({
  activities,
  activityTypesMap,
  onActivityClick,
}: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Group activities by date for O(1) cell lookup
  const activitiesByDate = new Map<string, Activity[]>();
  activities.forEach((activity) => {
    const key = activity.activity_date;
    if (!activitiesByDate.has(key)) activitiesByDate.set(key, []);
    activitiesByDate.get(key)!.push(activity);
  });

  // Build calendar grid (Monday-first to match Weekly view)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weeks: Date[][] = [];
  let cursor = calendarStart;
  while (cursor <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }

  const today = new Date();
  const isCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  const selectedDateActivities = selectedDate
    ? activitiesByDate.get(format(selectedDate, "yyyy-MM-dd")) || []
    : [];

  const toggleDay = (day: Date, isSelected: boolean) => {
    setSelectedDate(isSelected ? null : day);
  };

  const goToPrevMonth = () => setCurrentMonth((d) => subMonths(d, 1));
  const goToNextMonth = () => setCurrentMonth((d) => addMonths(d, 1));
  const goToCurrentMonth = () => setCurrentMonth(new Date());

  // input[type=month] yields "YYYY-MM" — append "-01" so parseISO works
  const handleMonthJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setCurrentMonth(parseISO(`${e.target.value}-01`));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ========================================
          MONTH NAVIGATION BAR
          Identical button style to Weekly view
          ======================================== */}
      <div className="flex items-center gap-3 mb-5">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevMonth}
          className="rounded-[2px] shrink-0 h-9 w-9 border-[#85754E]"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4 text-[#85754E]" />
        </Button>

        {/* "Today" chip — visible only when away from current month */}
        <AnimatePresence>
          {!isCurrentMonth && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={goToCurrentMonth}
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

        {/* Month label + calendar picker */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-sm font-semibold text-[#153E35]">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <div className="relative inline-flex items-center justify-center w-7 h-7">
            <input
              type="month"
              onChange={handleMonthJump}
              aria-label="Jump to month"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <CalendarDays className="h-4 w-4 text-[#85754E] pointer-events-none" />
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextMonth}
          className="rounded-[2px] shrink-0 h-9 w-9 border-[#85754E]"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4 text-[#85754E]" />
        </Button>
      </div>

      {/* ========================================
          CALENDAR GRID
          border-separate semantics replicated with
          CSS gap-[4px] + individual cell borders.
          ======================================== */}
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">

          {/* Day-of-week header row */}
          <div className="grid grid-cols-7 gap-[4px] mb-[4px]">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="p-3 text-center rounded-[2px] border border-[#85754E] bg-white"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] leading-none text-[#85754E]">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Week rows */}
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="grid grid-cols-7 gap-[4px] mb-[4px] last:mb-0"
            >
              {week.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayActivities = activitiesByDate.get(dateKey) || [];
                const isCurrentMonthDay = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, today);
                const isSelected = selectedDate
                  ? isSameDay(day, selectedDate)
                  : false;
                const overflowCount = dayActivities.length - CELL_LIMIT;

                return (
                  <div
                    key={dateKey}
                    className={cn(
                      "p-1.5 min-h-[90px] md:min-h-[110px] flex flex-col",
                      "rounded-[2px] border border-[#85754E]",
                      isToday
                        ? "bg-[#85754E]/10"
                        : isSelected
                        ? "bg-[#85754E]/15"
                        : "bg-white",
                      // Dim days outside the current month
                      !isCurrentMonthDay && "opacity-40"
                    )}
                  >
                    {/* ----------------------------------------
                        DAY NUMBER
                        Gold circle on today; clickable to expand
                        ---------------------------------------- */}
                    <button
                      onClick={() => toggleDay(day, isSelected)}
                      className={cn(
                        "self-center w-7 h-7 flex items-center justify-center mb-1 shrink-0",
                        "text-sm font-medium transition-colors rounded-[2px]",
                        isToday
                          ? "bg-[#85754E] text-white hover:bg-[#85754E]/90"
                          : "hover:bg-black/5 text-[#153E35]"
                      )}
                    >
                      {format(day, "d")}
                    </button>

                    {/* ----------------------------------------
                        INLINE ACTIVITY CHIPS
                        Up to CELL_LIMIT; each opens detail panel
                        ---------------------------------------- */}
                    {dayActivities.length > 0 && (
                      <div className="flex flex-col gap-0.5">
                        {dayActivities.slice(0, CELL_LIMIT).map((activity) => (
                          <button
                            key={activity.id}
                            onClick={() => onActivityClick(activity)}
                            title={activity.title}
                            className={cn(
                              "w-full text-left text-xs px-1 py-0.5 rounded-[2px]",
                              "bg-[#173F35]/10 hover:bg-[#173F35]/20 text-[#153E35]",
                              "line-clamp-1 leading-snug transition-colors duration-150"
                            )}
                          >
                            {activity.title}
                          </button>
                        ))}

                        {overflowCount > 0 && (
                          <button
                            onClick={() => toggleDay(day, isSelected)}
                            className="w-full text-left text-xs px-1 py-0.5 text-[#85754E] font-semibold hover:underline"
                          >
                            +{overflowCount} more
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================
          EXPANDED DAY DETAIL
          Shown when a day is selected
          ======================================== */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-[#85754E]">
              <h4 className="font-reforma-gris text-lg font-semibold text-[#153E35] mb-4">
                {format(selectedDate, "EEEE, MMMM d")}
                <span className="text-[#85754E] font-normal ml-2 text-sm">
                  ({selectedDateActivities.length} activit
                  {selectedDateActivities.length === 1 ? "y" : "ies"})
                </span>
              </h4>

              {selectedDateActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedDateActivities.map((activity, index) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      activityType={activityTypesMap.get(activity.type_id)}
                      onClick={() => onActivityClick(activity)}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[#153E35] text-center py-8">
                  No activities scheduled for this day.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
