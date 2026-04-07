/**
 * FILTER BAR COMPONENT
 *
 * Horizontal filter bar for activity filtering (List tab only).
 * Features:
 * - Time-of-day toggles with time range labels (Rise / Shine / Rest / Glow)
 * - Activity type chips (dynamic from database)
 * - Scrollable on mobile
 *
 * NOTE: "Revel" is stored in the DB as the TimeOfDay value, but is
 * displayed as "Glow" throughout the frontend per design spec.
 *
 * CUSTOMIZATION:
 * - Time range text: edit the `timeRange` field in TIME_OF_DAY_CONFIG
 * - Active chip color: bg-[#173F35] / border-[#173F35]
 */

"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActivityType, TimeOfDay } from "@/types/database";

/**
 * TIME_OF_DAY_CONFIG
 *
 * Display config for each time segment.
 * - label:     Shown on the chip button
 * - timeRange: Shown in parentheses next to the label
 *
 * "Revel" (DB value) is displayed as "Glow" here.
 */
const TIME_OF_DAY_CONFIG: Record<
  TimeOfDay,
  { label: string; timeRange: string; description: string }
> = {
  Rise:  { label: "Rise",  timeRange: "6am – 9am",   description: "Early morning (6am-9am)"   },
  Shine: { label: "Shine", timeRange: "9am – 12pm",  description: "Morning to midday (9am-12pm)" },
  Rest:  { label: "Rest",  timeRange: "12pm – 5pm",  description: "Afternoon (12pm-5pm)"        },
  Revel: { label: "Glow",  timeRange: "5pm onwards", description: "Evening (5pm onwards)"       },
};

interface FilterBarProps {
  /** Available activity types from database */
  activityTypes: ActivityType[];
  /** Currently selected type IDs */
  selectedTypes: string[];
  /** Currently selected time-of-day values (DB values: Rise/Shine/Rest/Revel) */
  selectedTimes: TimeOfDay[];
  /** Callback when type selection changes */
  onTypeChange: (typeId: string) => void;
  /** Callback when time-of-day selection changes */
  onTimeChange: (time: TimeOfDay) => void;
  /** Callback to clear all filters */
  onClearFilters: () => void;
}

/**
 * FilterBar
 *
 * Renders the activity filter controls for the List tab.
 * Scrolls horizontally on mobile; wraps on desktop.
 */
export function FilterBar({
  activityTypes,
  selectedTypes,
  selectedTimes,
  onTypeChange,
  onTimeChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = selectedTypes.length > 0 || selectedTimes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="py-4"
    >
      <div className="space-y-4">

        {/* ========================================
            TIME-OF-DAY TOGGLES
            Shows label + time range: e.g. "Rise (6am – 9am)"
            ======================================== */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <span className="text-sm font-medium text-[#153E35] shrink-0 mr-1">
            Time:
          </span>
          {(Object.keys(TIME_OF_DAY_CONFIG) as TimeOfDay[]).map((time) => {
            const config = TIME_OF_DAY_CONFIG[time];
            const isSelected = selectedTimes.includes(time);

            return (
              <button
                key={time}
                onClick={() => onTimeChange(time)}
                title={config.description}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 pt-[8px] pb-[8px] rounded-[2px]",
                  "text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-200",
                  "border touch-target shrink-0 leading-none whitespace-nowrap",
                  isSelected
                    ? "bg-[#173F35] text-white border-[#173F35]"
                    : "bg-background text-[#85754E] border-[#85754E] hover:border-[#85754E]/50 hover:text-[#85754E]"
                )}
              >
                <span>{config.label}</span>
                <span className="text-xs">({config.timeRange})</span>
                {isSelected && <X className="h-3 w-3 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* ========================================
            ACTIVITY TYPE CHIPS
            Scrollable list of activity categories
            ======================================== */}
        {activityTypes.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            <span className="text-sm font-medium text-[#153E35] shrink-0 mr-1">
              Type:
            </span>
            {activityTypes.map((type) => {
              const isSelected = selectedTypes.includes(type.id);

              return (
                <button
                  key={type.id}
                  onClick={() => onTypeChange(type.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 pt-[8px] pb-[8px] rounded-[2px] text-[11px] font-semibold uppercase tracking-[0.1em]",
                    "transition-all duration-200 border touch-target shrink-0 leading-none whitespace-nowrap",
                    isSelected
                      ? "bg-[#173F35] text-white border-[#173F35]"
                      : "bg-background text-[#85754E] border-[#85754E] hover:border-[#85754E]/50 hover:text-[#85754E]"
                  )}
                >
                  <span>{type.name}</span>
                  {isSelected && <X className="h-3 w-3 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </motion.div>
  );
}
